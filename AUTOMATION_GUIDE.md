# GitHub Actions Automation Guide

This guide explains how to automate the synchronization of your portfolio data (Medium blogs and GitHub projects) using GitHub Actions.

## 1. Prerequisites
- A portfolio project that stores data in local files (e.g., `src/data/blogs.ts`).
- Synchronization scripts (e.g., Node.js scripts that fetch from APIs and write to files).
- A GitHub Personal Access Token (PAT) with `repo` permissions if you're pushing back to the main branch.

## 2. Setting Up the Workflow
Create a `.yml` file in your `.github/workflows/` directory.

### Example: Sync Blogs Workflow
```yaml
name: Update Content

on:
  schedule:
    - cron: '0 0 * * *' # Runs every midnight
  workflow_dispatch: # Allows manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: npm install
        
      - name: Run Sync Scripts
        run: |
          node scripts/sync-blogs.js
          node scripts/sync-projects.js
          
      - name: Commit and Push
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add src/data/
          git commit -m "chore: automated content sync [skip ci]" || echo "No changes to commit"
          git push
```

## 3. Key Concepts
- **Cron Jobs**: Use `schedule` to keep your portfolio fresh without manual intervention.
- **`workflow_dispatch`**: Essential for testing your workflow without waiting for the schedule.
- **Permissions**: Ensure your action has permission to write to the repository. You might need to go to `Settings > Actions > General` and set "Workflow permissions" to "Read and write".

## 4. Why Automate?
1. **Consistency**: Your blog posts appear on your portfolio as soon as you publish them.
2. **Dynamic Stats**: Project star counts and updates stay current.
3. **No Maintenance**: Set it up once and your portfolio stays "alive" indefinitely.
