# Roadmap Sync Tool

This tool synchronizes a structured markdown roadmap with GitHub Projects. It parses the roadmap file, extracts tasks and subtasks, and creates corresponding GitHub issues with appropriate metadata (priority, size, type).

## Project Structure

```
roadmap-sync/
├── config/
│   └── config.js         # Configuration settings
├── src/
│   ├── parser.js         # Roadmap file parsing logic
│   ├── github.js         # GitHub API interactions
│   └── fields.js         # Project fields retrieval
├── utils/
│   └── logger.js         # Logging utilities
├── index.js             # Main entry point
├── get-fields.js        # Fields CLI tool
├── package.json         # Dependencies and scripts
└── README.md            # Documentation
```

## Prerequisites

1. A GitHub Personal Access Token with 'repo' and 'project' permissions
2. The token must be stored in a .env file as GITHUB_TOKEN
3. A GitHub Project (v2) with custom fields for priority, size, and type
4. Node.js and npm installed

## Installation

1. Create a `.env` file in the project root with your GitHub token:
   ```
   GITHUB_TOKEN=your_token_here
   ```

2. Install dependencies:
   ```bash
   cd scripts/roadmap-sync
   npm install
   ```

## Usage

### Retrieving Project Fields

Before configuring the sync tool, you'll need to get your GitHub Project field IDs. Use the `get-fields.js` tool:

```bash
# List all available projects
node get-fields.js

# Get fields for a specific project by ID
node get-fields.js PROJECT_ID

# Get fields for a project by owner and number
node get-fields.js OWNER PROJECT_NUMBER
```

### Running the Sync Tool

Run the sync tool:
```bash
npm start
```

Or from the project root:
```bash
node scripts/roadmap-sync/index.js
```

## Configuration

Update `config/config.js` with your GitHub information:
- Repository owner and name
- Project ID
- Field IDs for priority, size, and status
- Default values for tasks

## Features

- Parses structured markdown roadmap files
- Creates GitHub issues for tasks and subtasks
- Adds issues to GitHub Projects
- Sets priority, size, and type metadata
- Maintains epic relationships through labels
- Provides detailed logging and error handling
