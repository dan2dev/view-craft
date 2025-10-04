# Deployment Checklist

Quick reference for deploying to GitHub Pages.

## Pre-Deployment

- [ ] All changes committed to your working branch
- [ ] Tests pass (if applicable)
- [ ] `pnpm build` runs without errors
- [ ] `pnpm preview` shows expected changes locally

## Deploy

```bash
pnpm deploy
```

## Post-Deployment

- [ ] Check GitHub Actions workflow completed successfully
- [ ] Visit your GitHub Pages URL and verify changes are live
- [ ] Test key functionality on the live site

## First Time Only

If this is your first deployment, ensure:

- [ ] `gh-pages` branch exists (see below)
- [ ] GitHub Pages is configured in **Settings** → **Pages**
  - Source: "Deploy from a branch"
  - Branch: `gh-pages`
  - Folder: `/ (root)`

### Create gh-pages Branch

```bash
git checkout --orphan gh-pages
git rm -rf .
echo "<!DOCTYPE html><html><body>Initializing...</body></html>" > index.html
git add index.html
git commit -m "chore: initialize gh-pages branch"
git push -u origin gh-pages
git checkout main
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `pnpm build` to see full error output |
| "No changes to commit" | Normal - build is identical to current deploy |
| Permission denied | Check git credentials and push access |
| gh-pages branch missing | Follow "Create gh-pages Branch" above |
| Site not updating | Check GitHub Actions logs, wait 1-2 minutes |

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build locally
pnpm preview          # Preview build

# Deployment
pnpm deploy           # Build + deploy to GitHub Pages

# Manual deployment
./scripts/deploy.sh   # Run deploy script directly
```

## Resources

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Full deployment guide
- [scripts/README.md](../scripts/README.md) - Script documentation
- [GitHub Pages Docs](https://docs.github.com/en/pages)