/**
 * GitHub Project Fields Module
 * ==========================
 * 
 * Provides functionality to list GitHub Projects and retrieve field IDs
 * needed for roadmap synchronization configuration.
 * 
 * @module fields
 */

import { graphql } from '@octokit/graphql';
import { log } from '../utils/logger.js';

/**
 * List all available GitHub Projects for the authenticated user.
 * Includes both personal and organization projects.
 * 
 * @returns {Promise<void>}
 * @throws {Error} If the API request fails
 */
export async function listProjects() {
  try {
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
    
    log.header('\n=== Available Projects ===\n');
    
    // Display user projects
    log.info(`User Projects (${result.viewer.login}):`);
    if (result.viewer.projectsV2.nodes.length > 0) {
      result.viewer.projectsV2.nodes.forEach(project => {
        log.detail(`- ${project.title} (ID: ${project.id}, Number: ${project.number})`);
      });
    } else {
      log.warning('No projects found');
    }
    
    // Display organization projects
    if (result.viewer.organizations.nodes.length > 0) {
      result.viewer.organizations.nodes.forEach(org => {
        log.info(`\nOrganization Projects (${org.login}):`);
        if (org.projectsV2.nodes.length > 0) {
          org.projectsV2.nodes.forEach(project => {
            log.detail(`- ${project.title} (ID: ${project.id}, Number: ${project.number})`);
          });
        } else {
          log.warning('No projects found');
        }
      });
    }
  } catch (error) {
    log.error('Error listing projects:', error.message);
    throw error;
  }
}

/**
 * Get field IDs and option IDs for a specific project by its ID.
 * 
 * @param {string} projectId - The GitHub Project ID
 * @returns {Promise<Object>} Object containing field IDs and their options
 * @throws {Error} If the API request fails or project is not found
 */
export async function getProjectFieldsById(projectId) {
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
      throw new Error('Project not found');
    }

    log.header('\n=== Project Fields ===\n');
    
    const fields = {};
    const options = {};
    
    result.node.fields.nodes.forEach(field => {
      log.info(`Field: ${field.name}`);
      log.detail(`ID: ${field.id}`);
      fields[field.name.toLowerCase()] = field.id;
      
      if (field.options) {
        options[field.name.toLowerCase()] = {};
        field.options.forEach(option => {
          log.detail(`  Option: ${option.name} (${option.id})`);
          options[field.name.toLowerCase()][option.name.toLowerCase()] = option.id;
        });
      }
    });

    return { fields, options };
  } catch (error) {
    log.error('Error getting project fields:', error.message);
    throw error;
  }
}

/**
 * Get field IDs and option IDs for a project by owner and project number.
 * 
 * @param {string} owner - The GitHub username or organization name
 * @param {number} projectNumber - The project number
 * @returns {Promise<Object>} Object containing field IDs and their options
 * @throws {Error} If the API request fails or project is not found
 */
export async function getProjectFieldsByNumber(owner, projectNumber) {
  try {
    // First get the project ID
    const query = `
      query {
        user(login: "${owner}") {
          projectV2(number: ${projectNumber}) {
            id
          }
        }
      }
    `;

    const result = await graphqlWithAuth(query);
    
    if (!result.user?.projectV2?.id) {
      throw new Error('Project not found');
    }

    return getProjectFieldsById(result.user.projectV2.id);
  } catch (error) {
    log.error('Error getting project fields:', error.message);
    throw error;
  }
}
