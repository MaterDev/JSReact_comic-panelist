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
 * $ node scripts/roadmap-sync/index.js
 */

import dotenv from 'dotenv';
import { CONFIG } from './config/config.js';
import { log } from './utils/logger.js';
import { parseRoadmap } from './src/parser.js';
import { createIssues } from './src/github.js';

// Load environment variables
dotenv.config();

/**
 * Main execution function for the roadmap sync tool.
 * Orchestrates the process of parsing the roadmap and creating GitHub issues.
 * 
 * @returns {Promise<void>}
 * @throws {Error} If any part of the sync process fails
 * 
 * @example
 * // Run the sync process
 * await main()
 * 
 * // Handle any errors
 * try {
 *   await main()
 * } catch (error) {
 *   console.error('Sync failed:', error)
 * }
 */
async function main() {
  try {
    log.header('\nRoadmap to GitHub Projects Sync');
    log.header('================================\n');
    
    // Parse the roadmap file
    const roadmap = parseRoadmap(CONFIG.roadmapPath);
    
    // Create issues
    const success = await createIssues(roadmap);
    
    if (success) {
      log.success('\nSync completed successfully! 🎉');
      process.exit(0);
    } else {
      log.warning('\nSync completed with errors.');
      process.exit(1);
    }
  } catch (error) {
    log.error(`\nFatal error: ${error.message}`);
    if (error.stack) {
      log.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();
