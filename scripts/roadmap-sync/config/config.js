/**
 * Configuration Module
 * ==================
 * 
 * Central configuration for the roadmap sync tool.
 * Includes all GitHub-specific settings and field mappings required for
 * synchronizing roadmap items with GitHub Projects.
 * 
 * @module config
 */

/**
 * Configuration settings for the roadmap sync tool.
 * Contains GitHub repository information, project IDs, and field mappings.
 * 
 * @type {Object}
 */
export const CONFIG = {
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
