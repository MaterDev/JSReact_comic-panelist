#!/usr/bin/env node

/**
 * Roadmap to GitHub Projects Sync Script
 * 
 * This script reads a roadmap file in the standardized format and syncs it with GitHub Projects.
 * It creates issues for each task and subtask, with appropriate labels and metadata.
 * 
 * Usage: 
 *   node sync-roadmap.js
 * 
 * Configuration:
 *   Update the CONFIG object below with your GitHub information and roadmap path.
 */

import fs from 'fs';
import path from 'path';
import { graphql } from '@octokit/graphql';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration - Update these values
const CONFIG = {
  // Path to the roadmap file (relative to project root)
  roadmapPath: './docs/ROADMAP.md',
  
  // GitHub repository information
  owner: 'YOUR_GITHUB_USERNAME',
  repo: 'JSReact_comic-panelist',
  
  // GitHub Project ID (get this from the project URL or API)
  projectId: 'YOUR_PROJECT_ID',
  
  // Default values for tasks
  defaults: {
    priority: 'medium',
    size: 'm',
    type: 'feature',
  },
  
  // Field IDs for your GitHub Project (you'll need to get these from the API)
  fields: {
    priority: 'FIELD_ID_FOR_PRIORITY',
    size: 'FIELD_ID_FOR_SIZE',
    status: 'FIELD_ID_FOR_STATUS',
    epic: 'FIELD_ID_FOR_EPIC',
  },
};

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
 * Parse the roadmap file and extract structured data
 */
async function parseRoadmap(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const roadmap = {
      epics: [],
    };
    
    let currentEpic = null;
    let currentTask = null;
    let currentSubtask = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse Epic
      if (line.startsWith('## Epic:')) {
        const epicName = line.replace('## Epic:', '').trim();
        currentEpic = {
          name: epicName,
          key: '',
          description: '',
          tasks: [],
        };
        roadmap.epics.push(currentEpic);
        
        // Look for epic metadata in the next lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const metaLine = lines[j].trim();
          if (metaLine.startsWith('**Key**:')) {
            currentEpic.key = metaLine.replace('**Key**:', '').trim();
          } else if (metaLine.startsWith('**Description**:')) {
            currentEpic.description = metaLine.replace('**Description**:', '').trim();
          }
        }
      }
      
      // Parse Task
      else if (line.startsWith('### Task:') && currentEpic) {
        const taskName = line.replace('### Task:', '').trim();
        currentTask = {
          name: taskName,
          description: '',
          metadata: extractMetadata(lines, i),
          subtasks: [],
          acceptanceCriteria: [],
        };
        currentEpic.tasks.push(currentTask);
        currentSubtask = null;
        
        // Look for task description in the next lines
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const metaLine = lines[j].trim();
          if (metaLine.startsWith('**Description**:')) {
            currentTask.description = metaLine.replace('**Description**:', '').trim();
          }
        }
      }
      
      // Parse Subtask
      else if (line.startsWith('#### Subtask:') && currentTask) {
        const subtaskName = line.replace('#### Subtask:', '').trim();
        currentSubtask = {
          name: subtaskName,
          description: '',
          metadata: extractMetadata(lines, i),
          steps: [],
        };
        currentTask.subtasks.push(currentSubtask);
      }
      
      // Parse Acceptance Criteria
      else if (line.startsWith('**Acceptance Criteria**:') && currentTask) {
        // Look for criteria in the next lines
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
          const criteriaLine = lines[j].trim();
          if (criteriaLine.startsWith('- [ ]')) {
            const criteria = criteriaLine.replace('- [ ]', '').trim();
            currentTask.acceptanceCriteria.push(criteria);
          } else if (!criteriaLine.startsWith('-') && criteriaLine !== '') {
            break;
          }
        }
      }
      
      // Skip blockquote lines (technical notes)
      else if (line.startsWith('> ')) {
        // Skip technical notes in blockquotes
        continue;
      }
      // Parse Subtask Steps
      else if (line.startsWith('- [ ]') && currentSubtask) {
        const step = line.replace('- [ ]', '').trim();
        currentSubtask.steps.push(step);
        
        // Check for nested steps
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const nestedLine = lines[j].trim();
          if (nestedLine.startsWith('  - [ ]')) {
            const nestedStep = nestedLine.replace('  - [ ]', '').trim();
            currentSubtask.steps.push(`  ${nestedStep}`);
            i = j; // Skip this line in the main loop
          } else if (!nestedLine.startsWith('  -')) {
            break;
          }
        }
      }
    }
    
    return roadmap;
  } catch (error) {
    console.error('Error parsing roadmap:', error);
    throw error;
  }
}

/**
 * Extract metadata from HTML comments
 */
function extractMetadata(lines, lineIndex) {
  const metadata = {
    priority: CONFIG.defaults.priority,
    size: CONFIG.defaults.size,
    type: CONFIG.defaults.type,
    assignee: null,
    due: null,
  };
  
  // Look for HTML comment with metadata in the previous or next line
  const checkLine = (line) => {
    if (!line) return;
    
    const commentMatch = line.match(/<!--\s*(.*?)\s*-->/);
    if (commentMatch) {
      const commentContent = commentMatch[1];
      
      // Extract key:value pairs
      const pairs = commentContent.split(/\s+/);
      pairs.forEach(pair => {
        const [key, value] = pair.split(':');
        if (key && value) {
          metadata[key.trim()] = value.trim();
        }
      });
    }
  };
  
  // Check the line before and the line after
  if (lineIndex > 0) checkLine(lines[lineIndex - 1]);
  if (lineIndex < lines.length - 1) checkLine(lines[lineIndex + 1]);
  
  return metadata;
}

/**
 * Create GitHub issues for each task and subtask
 */
async function createIssues(roadmap) {
  console.log('Creating issues...');
  
  for (const epic of roadmap.epics) {
    console.log(`\nProcessing Epic: ${epic.name}`);
    
    for (const task of epic.tasks) {
      // Create task issue
      const taskTitle = `[${epic.key}] ${task.name}`;
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
      
      console.log(`  Creating task: ${taskTitle}`);
      
      try {
        const taskIssue = await octokit.issues.create({
          owner: CONFIG.owner,
          repo: CONFIG.repo,
          title: taskTitle,
          body: taskBody,
          labels: [`epic:${epic.key}`, `type:${task.metadata.type}`, `priority:${task.metadata.priority}`, `size:${task.metadata.size}`],
        });
        
        console.log(`    Created issue #${taskIssue.data.number}`);
        
        // Add to project
        await addIssueToProject(taskIssue.data.node_id);
        
        // Create subtask issues
        for (const subtask of task.subtasks) {
          const subtaskTitle = `[${epic.key}] ${subtask.name}`;
          let subtaskBody = `Part of #${taskIssue.data.number}\n\n`;
          
          if (subtask.steps.length > 0) {
            subtaskBody += '## Steps\n';
            subtask.steps.forEach(step => {
              subtaskBody += `- [ ] ${step}\n`;
            });
            subtaskBody += '\n';
          }
          
          subtaskBody += `*Generated from roadmap*`;
          
          console.log(`    Creating subtask: ${subtaskTitle}`);
          
          try {
            const subtaskIssue = await octokit.issues.create({
              owner: CONFIG.owner,
              repo: CONFIG.repo,
              title: subtaskTitle,
              body: subtaskBody,
              labels: [`epic:${epic.key}`, `type:${subtask.metadata.type}`, `priority:${subtask.metadata.priority}`, `size:${subtask.metadata.size}`],
            });
            
            console.log(`      Created issue #${subtaskIssue.data.number}`);
            
            // Add to project
            await addIssueToProject(subtaskIssue.data.node_id);
            
          } catch (error) {
            console.error(`      Error creating subtask issue:`, error.message);
          }
        }
        
      } catch (error) {
        console.error(`    Error creating task issue:`, error.message);
      }
    }
  }
}

/**
 * Add an issue to the GitHub Project
 */
async function addIssueToProject(issueId) {
  try {
    const result = await graphqlWithAuth(`
      mutation {
        addProjectV2ItemById(input: {
          projectId: "${CONFIG.projectId}"
          contentId: "${issueId}"
        }) {
          item {
            id
          }
        }
      }
    `);
    
    return result.addProjectV2ItemById.item.id;
  } catch (error) {
    console.error('Error adding issue to project:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Roadmap to GitHub Projects Sync');
    console.log('===============================');
    console.log(`Roadmap file: ${CONFIG.roadmapPath}`);
    console.log(`Repository: ${CONFIG.owner}/${CONFIG.repo}`);
    console.log(`Project ID: ${CONFIG.projectId}`);
    console.log('');
    
    // Parse the roadmap
    const roadmapPath = path.resolve(process.cwd(), CONFIG.roadmapPath);
    console.log(`Parsing roadmap file: ${roadmapPath}`);
    const roadmap = await parseRoadmap(roadmapPath);
    
    console.log(`Found ${roadmap.epics.length} epics`);
    let totalTasks = 0;
    let totalSubtasks = 0;
    
    roadmap.epics.forEach(epic => {
      totalTasks += epic.tasks.length;
      epic.tasks.forEach(task => {
        totalSubtasks += task.subtasks.length;
      });
    });
    
    console.log(`Found ${totalTasks} tasks and ${totalSubtasks} subtasks`);
    
    // Confirm before proceeding
    console.log('\nThis will create GitHub issues for all tasks and subtasks.');
    console.log('Make sure you have configured the correct repository and project ID.');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    
    // Wait 5 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create issues
    await createIssues(roadmap);
    
    console.log('\nSync completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
