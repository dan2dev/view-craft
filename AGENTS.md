# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`, with `core/` covering renderer primitives and `utility/` hosting shared helpers; `index.ts` exposes the public tag registry. Generated bundles and `.d.ts` output land in `dist/`—treat it as read-only. Shared shims sit in `types/`. Tests mirror the runtime tree under `test/` (for example `test/basic-dom/` and `test/utility/`). Use `examples/basic/` as the interactive playground and keep its dependencies installed separately.

## Build, Test, and Development Commands
- `pnpm build`: runs the full Rollup + types pipeline and refreshes `dist/`.
- `pnpm build:rollup` / `pnpm build:types`: run bundling or declarations independently while isolating failures.
- `pnpm dev`: watches the library for TypeScript and Rollup rebuilds.
- `pnpm dev:all`: pairs the library watcher with the example app (install inside `examples/basic/` first).
- `pnpm clean`: removes build artefacts.
- `pnpm test`, `pnpm test:watch`: execute or watch Vitest in a JSDOM environment.

## Coding Style & Naming Conventions
Write TypeScript with `strict` types and explicit return signatures on exported APIs. Indent with two spaces and keep import groups sorted by path depth. Favor named exports and camelCased filenames within feature folders (`elementFactory.ts`, `modifierHandlers.ts`). Reserve side-effect imports (`import "./utility/index";`) for entry points only.

## Testing Guidelines
Vitest drives coverage; structure new specs beside the module they guard and follow the `*.test.ts` naming scheme. Prefer deterministic DOM assertions, updating fixtures in `test/basic-dom/` whenever output shifts. Run `pnpm test` before sending patches; add focused suites when debugging (`pnpm test -- run utility/formatters`).

## Commit & Pull Request Guidelines
Keep commits short, imperative, and optionally scoped (`fix: adjust signal lifetimes`). Squash noisy spikes before opening a PR. Provide context in the description, link any issue, and include DOM before/after notes or screenshots when user-visible output changes. Confirm `pnpm build` and `pnpm test` locally prior to review.

## Security & Configuration Tips
Rely on the checked-in `tsconfig.json` and Rollup config; avoid storing secrets in the repo. Audit new dependencies before adding them to `package.json`, and prefer local `.env` files ignored by git for temporary tokens.
