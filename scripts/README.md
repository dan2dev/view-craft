# Deployment Scripts

## Local Build & Deploy

This directory contains scripts for building and deploying the project to GitHub Pages.

### Quick Start

To build and deploy to GitHub Pages:

```bash
pnpm deploy
```

Or run the script directly:

```bash
./scripts/deploy.sh
```

### What It Does

The `deploy.sh` script:

1. **Builds** the project using `pnpm build`
2. **Switches** to the `gh-pages` branch
3. **Replaces** the branch content with the new build from `dist/`
4. **Commits** the changes with a timestamped message
5. **Pushes** to GitHub
6. **Returns** you to your original branch

### Requirements

- Clean working directory (commit or stash changes first)
- `gh-pages` branch must exist
- Push access to the repository

### First Time Setup

If the `gh-pages` branch doesn't exist yet:

```bash
# Create an orphan branch (no history)
git checkout --orphan gh-pages

# Remove all files
git rm -rf .

# Create a placeholder
echo "Initial GitHub Pages" > index.html

# Commit and push
git add index.html
git commit -m "chore: initialize gh-pages branch"
git push -u origin gh-pages

# Return to main branch
git checkout main
```

### GitHub Pages Configuration

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `gh-pages` and folder to `/ (root)`
4. Save

### Troubleshooting

**"No changes to commit"**
- The build output is identical to what's already deployed
- This is normal and not an error

**Permission denied**
- Ensure you have push access to the repository
- Check your Git credentials are configured

**Build fails**
- Run `pnpm build` manually to see the error
- Fix TypeScript errors before deploying