#!/bin/bash

# Build and Deploy to GitHub Pages
# This script builds the project locally and pushes to the gh-pages branch

set -e # Exit on error

echo "🔨 Building project..."
pnpm build

echo "📦 Preparing deployment..."

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Create a temporary directory for the build
TEMP_DIR=$(mktemp -d)
cp -r dist/* "$TEMP_DIR/"

echo "🌿 Switching to gh-pages branch..."
git checkout gh-pages

# Remove old files (except .git, .nojekyll, and CNAME if present)
find . -maxdepth 1 ! -name '.git' ! -name '.nojekyll' ! -name 'CNAME' ! -name '.' -exec rm -rf {} + 2>/dev/null || true

# Copy new build files
cp -r "$TEMP_DIR"/* .

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo "📝 Committing changes..."
git add -A
git commit -m "deploy: update GitHub Pages from $CURRENT_BRANCH ($(date +'%Y-%m-%d %H:%M:%S'))" || {
  echo "⚠️  No changes to commit"
  git checkout "$CURRENT_BRANCH"
  exit 0
}

echo "🚀 Pushing to gh-pages branch..."
git push origin gh-pages

echo "✅ Deployment complete!"
echo "🔄 Returning to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

echo "🎉 Done! Your site will be live at your GitHub Pages URL in a few moments."