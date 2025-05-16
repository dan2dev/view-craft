.PHONY: publish

publish:
	@echo "Publishing with pnpm..."
	@pnpm build
	@pnpm publish