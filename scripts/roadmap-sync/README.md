# Roadmap Sync Tool

This tool synchronizes structured markdown roadmaps with GitHub Projects, creating issues and sub-issues with appropriate metadata.

## Features

- Parses structured markdown roadmaps with epics, tasks, and subtasks
- Creates GitHub issues with appropriate labels and metadata
- Establishes parent-child relationships between tasks and subtasks
- Adds issues to GitHub Projects with proper field values
- Interactive confirmation with keyboard shortcuts
- Configurable via command-line arguments

## Prerequisites

1. A GitHub Personal Access Token with 'repo' and 'project' permissions
2. The token must be stored in a `.env` file as `GITHUB_TOKEN`
3. A GitHub Project (v2) with custom fields for priority, size, and type
4. The `@octokit/graphql` and `@octokit/rest` packages

## Usage

```bash
# Use the default roadmap path
npm run sync-roadmap

# Use a custom roadmap path
npm run sync-roadmap -- --path=./path/to/your/roadmap.md

# Use the test roadmap
npm run sync-roadmap:test
```

## Interactive Controls

When running the script, you'll see configuration details and a prompt:

- Press `a` to accept and proceed with the sync
- Press `c` to cancel the operation
- Wait 15 seconds for automatic continuation

## Configuration

The configuration is defined in the `CONFIG` object within the script:

```javascript
const CONFIG = {
  // Path to the roadmap file (relative to project root)
  roadmapPath: './docs/roadmaps/03_ROADMAP_AlphaBuild-1_Tauri.md',
  
  // GitHub repository information
  owner: 'MaterDev',
  repo: 'JSReact_comic-panelist',
  
  // GitHub Project ID
  projectId: '11',
  
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
    epic: 'PVTF_lAHOAPUkmc4A1yv9zgrNKOI',
  },
  
  // Field option IDs for single select fields
  fieldOptions: {
    // Option values for priority, size, and status
  },
};
```

## Roadmap Format

The roadmap should follow this structured format:

```markdown
# Roadmap Title

## Epic: Epic Name
<!-- priority:high size:xl type:feature -->

**Description**: Epic description.

**Key**: EPIC-KEY

### Task: Task Name
<!-- priority:high size:l type:feature -->

**Description**: Task description.

**Acceptance Criteria**:
- [ ] Criteria 1
- [ ] Criteria 2

#### Subtask: Subtask Name
<!-- priority:high size:m type:feature -->
- [ ] Step 1
- [ ] Step 2
```

## Getting Field IDs

Use the `get-project-fields.js` script to retrieve field IDs for your GitHub Project:

```bash
node scripts/get-project-fields.js <project-number>
```

## Troubleshooting

If you encounter issues:

1. Verify your GitHub token has the correct permissions
2. Check that the project ID is correct
3. Ensure the roadmap file exists and follows the correct format
4. Look for error messages in the console output
