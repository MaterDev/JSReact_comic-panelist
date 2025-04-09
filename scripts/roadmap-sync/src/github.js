/**
 * GitHub Integration Module
 * ======================
 * 
 * Handles all interactions with the GitHub API, including:
 * - Creating issues from roadmap tasks
 * - Adding issues to project boards
 * - Setting issue metadata and labels
 * - Managing project board item titles
 * 
 * @module github
 */

import { graphql } from '@octokit/graphql';
import { Octokit } from '@octokit/rest';
import { CONFIG } from '../config/config.js';
import { log } from '../utils/logger.js';

// Initialize GitHub API clients
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  console.error('Please set it in a .env file or export it in your shell');
  process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const octokit = new Octokit({
  auth: token,
});

/**
 * Add an issue to the GitHub Project and update its title.
 * Resolves project numbers to actual project IDs if needed.
 * 
 * @param {string} issueId - The node ID of the GitHub issue
 * @param {string} cleanTitle - The clean title to use in the project board
 * @returns {Promise<string>} The project item ID
 * @throws {Error} If project resolution fails or item cannot be added
 */
export async function addIssueToProject(issueId, cleanTitle) {
  // Check if we're using a project number instead of ID
  let projectId = CONFIG.projectId;
  
  // If it's a number, try to get the actual project ID first
  if (!isNaN(parseInt(projectId)) && !projectId.startsWith('PVT_')) {
    try {
      const query = `
        query {
          user(login: "${CONFIG.owner}") {
            projectV2(number: ${parseInt(projectId)}) {
              id
            }
          }
        }
      `;
      
      const result = await graphqlWithAuth(query);
      if (result.user && result.user.projectV2) {
        projectId = result.user.projectV2.id;
        log.info(`Resolved project number ${CONFIG.projectId} to ID ${projectId}`);
      }
    } catch (error) {
      log.error(`Could not resolve project number to ID: ${error.message}`);
      throw error;
    }
  }
  
  try {
    // First add the item to the project
    const addResult = await graphqlWithAuth(`
      mutation {
        addProjectV2ItemById(input: {
          projectId: "${projectId}"
          contentId: "${issueId}"
        }) {
          item {
            id
          }
        }
      }
    `);
    
    const itemId = addResult.addProjectV2ItemById.item.id;

    // Then update the title field to remove brackets
    const titleFieldId = "title"; // Title is a built-in field
    await graphqlWithAuth(`
      mutation {
        updateProjectV2ItemFieldValue(input: {
          projectId: "${projectId}"
          itemId: "${itemId}"
          fieldId: "${titleFieldId}"
          value: {
            text: "${cleanTitle}"
          }
        }) {
          projectV2Item {
            id
          }
        }
      }
    `);

    return itemId;
  } catch (error) {
    log.error(`Error adding issue to project: ${error.message}`);
    throw error;
  }
}

/**
 * Create GitHub issues for each task and subtask in the roadmap.
 * Creates issues with appropriate metadata, labels, and project board items.
 * 
 * @param {Object} roadmap - The parsed roadmap data
 * @param {Array<Object>} roadmap.epics - List of epics from the roadmap
 * @returns {Promise<boolean>} True if all issues were created successfully
 * @throws {Error} If issue creation or project board updates fail
 */
export async function createIssues(roadmap) {
  log.subheader('Creating issues...');
  
  let hasErrors = false;
  let projectErrors = false;
  
  for (const epic of roadmap.epics) {
    log.epic(`Processing Epic: ${epic.name}`);
    
    for (const task of epic.tasks) {
      // Create task issue
      const taskTitle = `${task.name}`;
      let taskBody = `## Description\n${task.description}\n\n`;
      
      if (task.acceptanceCriteria.length > 0) {
        taskBody += '## Acceptance Criteria\n';
        task.acceptanceCriteria.forEach(criteria => {
          taskBody += `- [ ] ${criteria}\n`;
        });
        taskBody += '\n';
      }
      
      // Skip any technical notes (they're for internal documentation only)
      
      taskBody += `## Epic\n${epic.name}\n\n`;
      taskBody += `*Generated from roadmap*`;
      
      log.task(`Creating task: ${task.name}`);
      
      try {
        const taskIssue = await octokit.issues.create({
          owner: CONFIG.owner,
          repo: CONFIG.repo,
          title: taskTitle,
          body: taskBody,
          labels: [`epic:${epic.name}`, `type:${task.metadata.type}`, `priority:${task.metadata.priority}`, `size:${task.metadata.size}`],
        });
        
        log.success(`Created issue #${taskIssue.data.number}`);
        
        // Add to project
        try {
          await addIssueToProject(taskIssue.data.node_id, task.name);
          log.detail(`Added to project successfully`);
        } catch (projectError) {
          log.error(`Error adding issue to project: ${projectError.message}`);
          projectErrors = true;
          hasErrors = true;
        }
        
        // Create subtask issues
        for (const subtask of task.subtasks) {
          const subtaskTitle = `${subtask.name}`;
          let subtaskBody = `Part of #${taskIssue.data.number}\n\n`;
          
          if (subtask.steps.length > 0) {
            subtaskBody += '## Steps\n';
            subtask.steps.forEach(step => {
              subtaskBody += `- [ ] ${step}\n`;
            });
            subtaskBody += '\n';
          }
          
          subtaskBody += `*Generated from roadmap*`;
          
          log.subtask(`Creating subtask: ${subtask.name}`);
          
          try {
            const subtaskIssue = await octokit.issues.create({
              owner: CONFIG.owner,
              repo: CONFIG.repo,
              title: subtaskTitle,
              body: subtaskBody,
              labels: [`epic:${epic.name}`, `type:${subtask.metadata.type}`, `priority:${subtask.metadata.priority}`, `size:${subtask.metadata.size}`],
            });
            
            log.success(`Created issue #${subtaskIssue.data.number}`);
            
            // Add to project
            try {
              await addIssueToProject(subtaskIssue.data.node_id, subtask.name);
              log.detail(`Added to project successfully`);
            } catch (projectError) {
              log.error(`Error adding subtask issue to project: ${projectError.message}`);
              projectErrors = true;
              hasErrors = true;
            }
          } catch (error) {
            log.error(`Error creating subtask issue: ${error.message}`);
            hasErrors = true;
          }
        }
      } catch (error) {
        log.error(`Error creating task issue: ${error.message}`);
        hasErrors = true;
      }
    }
  }
  
  if (hasErrors) {
    if (projectErrors) {
      log.warning('\nThere were errors adding some issues to the project.');
      log.warning('This is often due to permission issues or incorrect project configuration.');
      log.warning('Please check the error messages above and verify your project settings.');
    } else {
      log.warning('\nThere were errors creating some issues.');
      log.warning('Please check the error messages above and try again.');
    }
  } else {
    log.success('\nAll issues created successfully!');
  }
  
  return !hasErrors;
}
