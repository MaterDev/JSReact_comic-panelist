#!/usr/bin/env node
/**
 * GitHub Project Fields Retriever
 * ==============================
 * 
 * This script lists all your GitHub Projects and their IDs, then allows you to
 * retrieve field IDs for a specific project to configure the sync-roadmap.js script.
 * 
 * Prerequisites:
 * -------------
 * 1. A GitHub Personal Access Token with 'repo' and 'issues' permissions
 * 2. The token must be stored in a .env file as GITHUB_TOKEN
 * 3. The @octokit/graphql package must be installed
 * 
 * Usage:
 * ------
 * $ node scripts/get-project-fields.js              # Lists all available projects
 * $ node scripts/get-project-fields.js PROJECT_ID   # Gets fields for a specific project
 * 
 * Output:
 * -------
 * The script outputs field IDs and option IDs in a format that can be directly
 * copied into the sync-roadmap.js configuration.
 */

import dotenv from 'dotenv';
import { graphql } from '@octokit/graphql';

// Load environment variables
dotenv.config();

// Make sure you have a GITHUB_TOKEN in your .env file
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is required.');
  console.error('Please create a .env file with your GitHub token:');
  console.error('GITHUB_TOKEN=your_github_token_here');
  process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

// Function to list all available projects
const listProjects = async () => {
  try {
    // Query for user's projects
    const query = `
      query {
        viewer {
          login
          projectsV2(first: 10) {
            nodes {
              id
              title
              number
            }
          }
          organizations(first: 5) {
            nodes {
              login
              projectsV2(first: 10) {
                nodes {
                  id
                  title
                  number
                }
              }
            }
          }
        }
      }
    `;

    const result = await graphqlWithAuth(query);
    
    console.log('\n=== Available Projects ===\n');
    
    // Display user projects
    console.log(`User Projects (${result.viewer.login}):`);
    if (result.viewer.projectsV2.nodes.length > 0) {
      result.viewer.projectsV2.nodes.forEach(project => {
        console.log(`- ${project.title} (ID: ${project.id}, Number: ${project.number})`);
      });
    } else {
      console.log('No projects found');
    }
    
    // Display organization projects
    if (result.viewer.organizations.nodes.length > 0) {
      result.viewer.organizations.nodes.forEach(org => {
        console.log(`\nOrganization Projects (${org.login}):`);
        if (org.projectsV2.nodes.length > 0) {
          org.projectsV2.nodes.forEach(project => {
            console.log(`- ${project.title} (ID: ${project.id}, Number: ${project.number})`);
          });
        } else {
          console.log('No projects found for this organization');
        }
      });
    }
    
    console.log('\nTo get field details for a specific project, run:');
    console.log('node scripts/get-project-fields.js PROJECT_ID');
    
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    if (error.errors) {
      console.error('GraphQL Errors:', error.errors);
    }
    process.exit(1);
  }
};

// Function to get fields for a specific project by ID
const getProjectFieldsById = async (projectId) => {
  try {
    const query = `
      query {
        node(id: "${projectId}") {
          ... on ProjectV2 {
            fields(first: 20) {
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                }
                ... on ProjectV2IterationField {
                  id
                  name
                  configuration {
                    iterations {
                      startDate
                      id
                    }
                  }
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await graphqlWithAuth(query);
    
    if (!result.node) {
      console.error(`Error: Project with ID ${projectId} not found.`);
      console.error('Please check the ID and try again.');
      process.exit(1);
    }
    
    console.log('\n=== Project Fields ===\n');
    
    // Extract field IDs and options for single select fields
    const fields = result.node.fields.nodes;
    
    console.log('Field IDs for sync-roadmap.js:');
    console.log('fields: {');
    
    fields.forEach(field => {
      console.log(`  // ${field.name}`);
      console.log(`  ${field.name.toLowerCase().replace(/\s+/g, '_')}: '${field.id}',`);
    });
    
    console.log('},');
    
    console.log('\nField options for single select fields:');
    console.log('fieldOptions: {');
    
    fields.forEach(field => {
      if (field.options) {
        console.log(`  // ${field.name} options`);
        console.log(`  ${field.name.toLowerCase().replace(/\s+/g, '_')}: {`);
        field.options.forEach(option => {
          const key = option.name.toLowerCase().replace(/\s+/g, '_');
          console.log(`    ${key}: '${option.id}',`);
        });
        console.log('  },');
      }
    });
    
    console.log('},');
    
  } catch (error) {
    console.error('Error fetching project fields:', error.message);
    if (error.errors) {
      console.error('GraphQL Errors:', error.errors);
    }
    process.exit(1);
  }
};

// Function to get fields for a project by owner and number
const getProjectFieldsByNumber = async (owner, projectNumber) => {
  try {
    // First, get the project ID from the owner and number
    const query = `
      query {
        user(login: "${owner}") {
          projectV2(number: ${projectNumber}) {
            id
            title
            fields(first: 20) {
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                }
                ... on ProjectV2IterationField {
                  id
                  name
                  configuration {
                    iterations {
                      startDate
                      id
                    }
                  }
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await graphqlWithAuth(query);
    
    if (!result.user || !result.user.projectV2) {
      console.error(`Error: Project number ${projectNumber} not found for user ${owner}.`);
      process.exit(1);
    }
    
    const project = result.user.projectV2;
    console.log(`\n=== Project Fields for "${project.title}" ===\n`);
    
    // Extract field IDs and options for single select fields
    const fields = project.fields.nodes;
    
    console.log('Field IDs for sync-roadmap.js:');
    console.log('fields: {');
    
    fields.forEach(field => {
      console.log(`  // ${field.name}`);
      console.log(`  ${field.name.toLowerCase().replace(/\s+/g, '_')}: '${field.id}',`);
    });
    
    console.log('},');
    
    console.log('\nField options for single select fields:');
    console.log('fieldOptions: {');
    
    fields.forEach(field => {
      if (field.options) {
        console.log(`  // ${field.name} options`);
        console.log(`  ${field.name.toLowerCase().replace(/\s+/g, '_')}: {`);
        field.options.forEach(option => {
          const key = option.name.toLowerCase().replace(/\s+/g, '_');
          console.log(`    ${key}: '${option.id}',`);
        });
        console.log('  },');
      }
    });
    
    console.log('},');
    
  } catch (error) {
    console.error('Error fetching project fields:', error.message);
    if (error.errors) {
      console.error('GraphQL Errors:', error.errors);
    }
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  // Check if a project ID was provided as a command line argument
  const arg = process.argv[2];
  
  if (arg && arg.startsWith('PVT_')) {
    // If the argument is a project ID
    await getProjectFieldsById(arg);
  } else if (arg && !isNaN(parseInt(arg))) {
    // If the argument is a project number
    await getProjectFieldsByNumber('MaterDev', parseInt(arg));
  } else {
    try {
      await listProjects();
    } catch (error) {
      console.log('\nCould not list projects due to permission issues.');
      console.log('Try using the project number directly:');
      console.log('node scripts/get-project-fields.js 11');
    }
  }
};

main();
