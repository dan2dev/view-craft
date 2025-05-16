.PHONY: publish

publish:
	@echo "Publishing with pnpm..."
	@pnpm build
	@echo "Bumping patch version..."
	@pnpm version patch --no-git-checks
	@pnpm publish --no-git-checks