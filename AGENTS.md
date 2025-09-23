# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`, split into `core/` for rendering primitives, `utility/` for shared helpers, and `index.ts` that registers tags for consumers. Generated bundles and type declarations land in `dist/`; never edit them directly. Shared `.d.ts` shims reside in `types/`. Tests mirror the source under `test/`, with folders such as `test/basic-dom/` and `test/utility/` covering DOM behaviour and helper logic. Use `examples/basic/` as a sandbox when verifying interactive flows.

## Build, Test, and Development Commands
Use `pnpm build` to clean and rebuild Rollup bundles plus declaration files. Run `pnpm dev` for watch mode on the library, or `pnpm dev:all` to pair the library watcher with the basic example app (requires `npm install` inside `examples/basic`). `pnpm clean` removes `dist/` and TypeScript build info. When debugging bundling alone, `pnpm build:rollup` and `pnpm build:types` run each stage independently.

## Coding Style & Naming Conventions
Code is TypeScript-first with `strict` compiler settings; respect existing generic signatures and favour explicit return types for exported APIs. Indent with two spaces, keep imports sorted by path depth, and prefer named exports over defaults. File names stay camelCase within feature folders (`elementFactory.ts`, `modifierHandlers.ts`). Keep side-effect imports (`import "./utility/index";`) limited to entry points. No lint script is defined today; rely on TypeScript and Vitest failures to catch regressions.

## Testing Guidelines
Vitest with the JSDOM environment backs the suite; run `pnpm test` for coverage or `pnpm test:watch` while iterating. Place new specs beside peers in `test/`, naming files `*.test.ts`. Mirror the runtime module tree so contributors can spot gaps quickly. Include DOM snapshots or helper-focused unit tests as appropriate, and update fixtures in `test/basic-dom/` when changing render output.

## Commit & Pull Request Guidelines
Follow the existing history: short, imperative commit subjects, optionally prefixed with a scope (`chore: bump Rollup`). Squash noisy commits before opening a PR. Every PR should describe the change, link to any issue, and call out UI or DOM diffs with before/after notes or screenshots. Confirm `pnpm build` and `pnpm test` pass locally before requesting review.

## Release & Publishing
Publishing is automated through `make publish`, which triggers `pnpm build`, bumps the patch version, and publishes with `pnpm publish --no-git-checks`. Coordinate releases with maintainers and run the command only from a clean `main` branch.
