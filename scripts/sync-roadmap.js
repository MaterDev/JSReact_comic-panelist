#!/usr/bin/env node

/**
 * Roadmap to GitHub Projects Sync Script
 * ===================================
 *
 * This script synchronizes a structured markdown roadmap with GitHub Projects.
 * It parses the roadmap file, extracts tasks and subtasks, and creates corresponding
 * GitHub issues with appropriate metadata (priority, size, type).
 *
 * Prerequisites:
 * -------------
 * 1. A GitHub Personal Access Token with 'repo' and 'project' permissions
 * 2. The token must be stored in a .env file as GITHUB_TOKEN
 * 3. A GitHub Project (v2) with custom fields for priority, size, and type
 * 4. The @octokit/graphql and @octokit/rest packages must be installed
 *
 * Usage:
 * ------
 * $ node scripts/sync-roadmap.js
 *
 * Configuration:
 * -------------
 * Update the config object below with your GitHub username, repository name,
 * project ID, and field IDs. You can use the get-project-fields.js script to
 * retrieve the field IDs for your GitHub Project.
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

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Helper functions for colored output
const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bright}${colors.white}${msg}${colors.reset}`),
  subheader: (msg) => console.log(`${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  epic: (msg) => console.log(`\n${colors.bgBlue}${colors.white} ${msg} ${colors.reset}`),
  task: (msg) => console.log(`  ${colors.bright}${colors.blue}${msg}${colors.reset}`),
  subtask: (msg) => console.log(`    ${colors.blue}${msg}${colors.reset}`),
  detail: (msg) => console.log(`      ${colors.dim}${msg}${colors.reset}`),
};

// Configuration - Update these values
const CONFIG = {
  // Path to the roadmap file (relative to project root)
  roadmapPath: './docs/ROADMAP_STRUCTURED.md',
  
  // GitHub repository information
  owner: 'MaterDev',
  repo: 'JSReact_comic-panelist',
  
  // GitHub Project ID (get this from the project URL or API)
  projectId: '11', // Using project number instead of ID
  
  // Default values for tasks
  defaults: {
    priority: 'medium',
    size: 'm',
    type: 'feature',
  },
  
  // Field IDs for your GitHub Project
  // Retrieved using: node scripts/get-project-fields.js 11
  fields: {
    priority: 'PVTSSF_lAHOAPUkmc4A1yv9zgrNK_Q',
    size: 'PVTSSF_lAHOAPUkmc4A1yv9zgrNK_U',
    status: 'PVTSSF_lAHOAPUkmc4A1yv9zgrNKOE',
    // No specific epic field, but we can use labels or parent_issue
    epic: 'PVTF_lAHOAPUkmc4A1yv9zgrNKOI', // Using labels for epics
  },
  
  // Field option IDs for single select fields
  fieldOptions: {
    priority: {
      high: '79628723', // p0
      medium: '0a877460', // p1
      low: 'da944a9c', // p2
    },
    size: {
      xl: '7b141a16',
      l: 'c53df028',
      m: '9728cbdc',
      s: '9592a5a3',
      xs: 'eff732af',
    },
    status: {
      todo: 'f75ad846', // backlog
      ready: '08afe404',
      in_progress: '47fc9ee4',
      in_review: '4cc61d42',
      done: '98236657',
    },
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
  log.subheader('Creating issues...');
  
  let hasErrors = false;
  let projectErrors = false;
  
  for (const epic of roadmap.epics) {
    log.epic(`Processing Epic: ${epic.name}`);
    
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
          await addIssueToProject(taskIssue.data.node_id);
          log.detail(`Added to project successfully`);
        } catch (projectError) {
          log.error(`Error adding issue to project: ${projectError.message}`);
          projectErrors = true;
          hasErrors = true;
        }
        
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
              await addIssueToProject(subtaskIssue.data.node_id);
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
  
  log.header('\nSync Summary');
  log.header('===========');
  
  if (hasErrors) {
    if (projectErrors) {
      log.error('\nSync completed with errors:');
      log.error('1. Issues were created successfully');
      log.error(`2. Issues could not be added to the project (ID: ${CONFIG.projectId})`);
      log.error('\nPossible causes:');
      log.error('- The project ID is incorrect');
      log.error('- The token does not have permission to access the project');
      log.error('- The project may be in an organization rather than a user project');
      log.error('\nTo fix:');
      log.error('1. Verify the project ID using the get-project-fields.js script');
      log.error('2. Check token permissions (needs repo and project scopes)');
      log.error('3. Delete the created issues and try again after fixing the issues');
    } else {
      log.error('\nSync completed with errors. Please check the output above.');
    }
  } else {
    log.success('\nSync completed successfully!');
  }
}

/**
 * Add an issue to the GitHub Project
 */
async function addIssueToProject(issueId) {
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
    const result = await graphqlWithAuth(`
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
    
    return result.addProjectV2ItemById.item.id;
  } catch (error) {
    log.error(`Error adding issue to project: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    log.header('Roadmap to GitHub Projects Sync');
    log.header('===============================');
    log.info(`Roadmap file: ${CONFIG.roadmapPath}`);
    log.info(`Repository: ${CONFIG.owner}/${CONFIG.repo}`);
    log.info(`Project ID: ${CONFIG.projectId}`);
    
    // Parse the roadmap
    const roadmapPath = path.resolve(process.cwd(), CONFIG.roadmapPath);
    log.info(`\nParsing roadmap file: ${roadmapPath}`);
    const roadmap = await parseRoadmap(roadmapPath);
    
    log.success(`Found ${roadmap.epics.length} epics`);
    let totalTasks = 0;
    let totalSubtasks = 0;
    
    roadmap.epics.forEach(epic => {
      totalTasks += epic.tasks.length;
      epic.tasks.forEach(task => {
        totalSubtasks += task.subtasks.length;
      });
    });
    
    log.success(`Found ${totalTasks} tasks and ${totalSubtasks} subtasks`);
    
    // Confirm before proceeding
    log.warning('\nThis will create GitHub issues for all tasks and subtasks.');
    log.warning('Make sure you have configured the correct repository and project ID.');
    log.warning('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    
    // Wait 5 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create issues
    await createIssues(roadmap);
    
  } catch (error) {
    log.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
