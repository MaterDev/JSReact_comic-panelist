#!/usr/bin/env node

/**
 * GitHub Project Fields CLI Tool
 * ============================
 * 
 * Lists GitHub Projects and retrieves field IDs for configuring the roadmap sync tool.
 * 
 * Usage:
 * ------
 * $ node get-fields.js              # Lists all available projects
 * $ node get-fields.js PROJECT_ID   # Gets fields for a specific project
 * $ node get-fields.js OWNER NUMBER # Gets fields by owner and project number
 */

import dotenv from 'dotenv';
import { listProjects, getProjectFieldsById, getProjectFieldsByNumber } from './src/fields.js';
import { log } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Make sure you have a GITHUB_TOKEN in your .env file
const token = process.env.GITHUB_TOKEN;

if (!token) {
  log.error('Error: GITHUB_TOKEN environment variable is required.');
  log.error('Please create a .env file with your GitHub token:');
  log.error('GITHUB_TOKEN=your_github_token_here');
  process.exit(1);
}

async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      // No arguments - list all projects
      await listProjects();
    } else if (args.length === 1) {
      // One argument - get fields by project ID
      await getProjectFieldsById(args[0]);
    } else if (args.length === 2) {
      // Two arguments - get fields by owner and project number
      await getProjectFieldsByNumber(args[0], parseInt(args[1]));
    } else {
      log.error('Invalid number of arguments.');
      log.info('\nUsage:');
      log.info('  node get-fields.js              # List all projects');
      log.info('  node get-fields.js PROJECT_ID   # Get fields by ID');
      log.info('  node get-fields.js OWNER NUMBER # Get fields by owner/number');
      process.exit(1);
    }
  } catch (error) {
    log.error('Error:', error.message);
    process.exit(1);
  }
}

main();
