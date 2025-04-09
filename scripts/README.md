# Comic Panelist Scripts

This directory contains utility scripts for the Comic Panelist project. These scripts help with project management, roadmap synchronization, and other development tasks.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Available Scripts](#available-scripts)
  - [Roadmap Sync](#roadmap-sync)
  - [Get Project Fields](#get-project-fields)
- [Workflow Guide](#workflow-guide)

## Environment Setup

These scripts require certain environment variables to function properly. Create a `.env` file in the root directory of the project with the following variables:

```
# GitHub Personal Access Token (required for GitHub API access)
# Needs 'repo' and 'project' scopes
GITHUB_TOKEN=your_github_token_here
```

### Creating a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give it a descriptive name like "Comic Panelist Roadmap Sync"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `project` (Full control of user projects)
5. Click "Generate token"
6. Copy the token and add it to your `.env` file

## Available Scripts

### Roadmap Sync

**Directory:** `roadmap-sync/`

This tool synchronizes structured markdown roadmaps with GitHub Projects. It parses the roadmap file, extracts tasks and subtasks, and creates corresponding GitHub issues with appropriate metadata (priority, size, type).

#### Key Features

- Creates GitHub issues for epics, tasks, and subtasks
- Establishes parent-child relationships between tasks and subtasks
- Adds issues to GitHub Projects with proper field values
- Interactive confirmation with keyboard shortcuts (a to accept, c to cancel)
- Configurable via command-line arguments
- Detailed configuration display before execution

#### Configuration

The script uses a configuration object that you can modify in the `sync-roadmap.js` file:

```javascript
const CONFIG = {
  // Path to the roadmap file (relative to project root)
  roadmapPath: './docs/ROADMAP_STRUCTURED.md',
  
  // GitHub repository information
  owner: 'MaterDev',
  repo: 'JSReact_comic-panelist',
  
  // GitHub Project ID or number
  projectId: '11', // Using project number instead of ID
  
  // Default values for tasks
  defaults: {
    priority: 'medium',
    size: 'm',
    type: 'feature',
  },
  
  // Field IDs for your GitHub Project
  fields: {
    priority: 'PVTSSF_lAHOAPUkmc4A1yv9zgrNK_Q',
    size: 'PVTSSF_lAHOAPUkmc4A1yv9zgrNK_U',
    status: 'PVTSSF_lAHOAPUkmc4A1yv9zgrNKOE',
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
```

#### Usage

The script can be run using npm scripts:

```bash
# Use the default roadmap path
npm run sync-roadmap

# Use a custom roadmap path
npm run sync-roadmap -- --path=./path/to/your/roadmap.md

# Use the test roadmap
npm run sync-roadmap:test
```

The script will:
1. Parse the roadmap file
2. Create GitHub issues for each task and subtask
3. Add the issues to your GitHub Project
4. Set appropriate metadata (priority, size, status)
5. Link subtasks to their parent tasks

### Get Project Fields

**File:** `get-project-fields.js`

This script helps you retrieve field IDs from your GitHub Project, which are needed for the sync-roadmap.js script.

#### Usage

To list all available projects:

```bash
node scripts/get-project-fields.js
```

To get field IDs for a specific project:

```bash
node scripts/get-project-fields.js <project_number>
```

Example:

```bash
node scripts/get-project-fields.js 11
```

The script will output field IDs and field option IDs in a format that can be directly copied into the sync-roadmap.js configuration.

## Workflow Guide

### Setting Up Roadmap Sync

1. **Create a GitHub Project**
   - Go to your GitHub profile or organization
   - Create a new project (v2)
   - Add custom fields for priority, size, status, etc.

2. **Get Project Fields**
   - Run `node scripts/get-project-fields.js` to list all available projects
   - Note your project number (e.g., 11)
   - Run `node scripts/get-project-fields.js 11` to get field IDs
   - Copy the output into the CONFIG object in sync-roadmap.js

3. **Create/Update Roadmap**
   - Edit the roadmap file (docs/ROADMAP_STRUCTURED.md)
   - Follow the structured format for epics, tasks, and subtasks

4. **Sync Roadmap**
   - Run `node scripts/sync-roadmap.js`
   - The script will create GitHub issues and add them to your project
   - Review the output for any errors

### Roadmap Format

The roadmap file should follow this structure:

```markdown
# Project Roadmap

## Epic: [Epic Name]
**Key**: [Epic Key]
**Description**: [Epic Description]

### Task: [Task Name]
**Priority**: [high|medium|low]
**Size**: [xl|l|m|s|xs]
**Type**: [feature|bug|chore]
**Description**: [Task Description]

#### Acceptance Criteria
- [Criterion 1]
- [Criterion 2]

##### Technical Notes
- [Technical Note 1]
- [Technical Note 2]

#### Subtask: [Subtask Name]
**Priority**: [high|medium|low]
**Size**: [xl|l|m|s|xs]
**Type**: [feature|bug|chore]

##### Steps
- [Step 1]
- [Step 2]
```

### Troubleshooting

- **Authentication Errors**: Make sure your GitHub token has the correct scopes (repo and project)
- **Project ID Errors**: Try using the project number instead of the full ID
- **Permission Errors**: Ensure you have access to the repository and project
- **Field ID Errors**: Run the get-project-fields.js script again to get the latest field IDs
