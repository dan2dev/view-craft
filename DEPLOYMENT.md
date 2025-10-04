# Deployment Guide

## Overview

This project uses a **local build + GitHub Pages deployment** workflow. Builds happen on your machine, not in CI/CD, giving you full control over what gets deployed.

## Quick Deploy

```bash
pnpm deploy
```

That's it! The script will:
1. ✅ Build the project (`pnpm build`)
2. ✅ Switch to the `gh-pages` branch
3. ✅ Replace all content with the fresh build
4. ✅ Commit with a timestamp
5. ✅ Push to GitHub
6. ✅ Return you to your original branch

Your site will be live at your GitHub Pages URL within moments.

## Prerequisites

### First Time Setup

If you haven't deployed before, create the `gh-pages` branch:

```bash
# Create orphan branch (no history)
git checkout --orphan gh-pages

# Clear everything
git rm -rf .

# Add placeholder
echo "<!DOCTYPE html><html><body>Initializing...</body></html>" > index.html

# Commit and push
git add index.html
git commit -m "chore: initialize gh-pages branch"
git push -u origin gh-pages

# Return to main
git checkout main
```

### GitHub Pages Configuration

1. Go to **Settings** → **Pages** in your GitHub repo
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `gh-pages` and folder to `/ (root)`
4. Save

## Workflow Details

### Local Script (`scripts/deploy.sh`)

The deployment script is a simple Bash script that:
- Builds your project locally using `pnpm build`
- Creates a temporary directory for the build output
- Switches to the `gh-pages` branch
- Replaces all files (except `.git`, `.nojekyll`, and `CNAME`) with the new build
- Commits and pushes to GitHub
- Returns you to your original branch

Run directly: `./scripts/deploy.sh`  
Or via npm: `pnpm deploy`

### GitHub Actions (`.github/workflows/deploy.yml`)

The GitHub Actions workflow is minimal:
- **Triggers** when the `gh-pages` branch is pushed
- **Does NOT build** anything (build already happened locally)
- Simply uploads the branch content as a Pages artifact
- Deploys to GitHub Pages infrastructure

This approach gives you:
- ✅ **Control**: You verify the build locally before deploying
- ✅ **Speed**: No CI/CD queue time
- ✅ **Simplicity**: No need to configure Node, pnpm, or dependencies in CI
- ✅ **Debugging**: Build errors are on your machine, not in logs somewhere

## Common Tasks

### Deploy After Changes

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Build and deploy
pnpm deploy
```

### Preview Before Deploy

```bash
# Build locally
pnpm build

# Preview the build
pnpm preview

# If it looks good, deploy
pnpm deploy
```

### Rollback to Previous Deploy

```bash
git checkout gh-pages
git log  # Find the commit you want
git reset --hard <commit-hash>
git push origin gh-pages --force
git checkout main
```

## Troubleshooting

### "No changes to commit"

This is normal! It means your build output is identical to what's already deployed. The script will skip pushing and return you to your original branch.

### "error: pathspec 'gh-pages' did not match"

The `gh-pages` branch doesn't exist yet. Follow the "First Time Setup" instructions above.

### "Permission denied"

Check that you have push access to the repository:
```bash
git remote -v
git config user.name
git config user.email
```

### "Build failed"

The script stops on build errors. Run `pnpm build` manually to see the full TypeScript error output:
```bash
pnpm build
```

Fix any type errors before deploying.

### Uncommitted Changes Warning

If you have uncommitted changes, git might warn you when switching branches. Either:
- Commit your changes: `git add . && git commit -m "wip"`
- Stash them: `git stash`
- Or let the script handle it (it won't overwrite your work)

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production (TypeScript + Vite) |
| `pnpm preview` | Preview production build locally |
| `pnpm deploy` | Build and deploy to GitHub Pages |

## Architecture

```
┌─────────────┐
│  Your Code  │
└──────┬──────┘
       │
       │ pnpm build
       ▼
┌─────────────┐
│   dist/     │  ← Build output (TypeScript compiled, Vite bundled)
└──────┬──────┘
       │
       │ scripts/deploy.sh
       ▼
┌─────────────┐
│  gh-pages   │  ← Git branch with built files only
│   branch    │
└──────┬──────┘
       │
       │ git push
       ▼
┌─────────────┐
│   GitHub    │  ← Actions workflow uploads artifact
└──────┬──────┘
       │
       │ actions/deploy-pages
       ▼
┌─────────────┐
│ GitHub Pages│  ← Live site!
│   (CDN)     │
└─────────────┘
```

## Why Local Builds?

**Pros:**
- ✅ Faster feedback loop (no CI queue)
- ✅ No CI configuration for Node/pnpm versions
- ✅ Build errors are immediate and local
- ✅ You control exactly what gets deployed
- ✅ No CI minutes consumed

**Cons:**
- ❌ Requires manual deploy step
- ❌ Different machines might produce slightly different builds
- ❌ No automatic deploy on merge

For this project, the pros outweigh the cons. If you need automatic deploys, consider setting up a full CI/CD build pipeline instead.

## Further Reading

- [scripts/README.md](scripts/README.md) - Detailed script documentation
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)