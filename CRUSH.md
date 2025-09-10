# CRUSH.md — view-craft agentic coding guide

## Build, Lint, and Test Commands

- **Build:**
  - `pnpm build` — clean & build with Rollup + TypeScript declarations
- **Typecheck:**
  - `pnpm exec tsc --noEmit` — typecheck only
- **Test all:**
  - `pnpm test` — run all tests using Vitest
- **Run a single test file:**
  - `pnpm test -- test/<file>.test.ts`
- **Run a single test by name:**
  - `pnpm test -t "test name here"`

_No explicit linter found; add ESLint/Prettier if style enforcement is required._

## Code Style Guidelines

- **Imports:**  Always use ES Modules (`import/export`). Prefer relative imports within `/src`, omit file extensions.
- **Formatting:**
  - 2-space indentation.
  - Use double quotes for strings.
  - Include trailing commas for objects/arrays when multiline.
- **Types:**
  - TypeScript strict mode: always provide explicit types for function parameters and return values.
  - Use generics and utility types when possible (see usage of `type-fest`).
- **Naming:**
  - Variables and functions: `camelCase`
  - Types, interfaces, and classes: `PascalCase`
  - Filenames: `kebab-case` or `lowercase`
- **Error Handling:**
  - Defensive checks for `null`/`undefined`, but little use of try/catch (let exceptions propagate unless recoverable case is explicit).
- **Testing:**
  - Use `vitest`.
  - Prefer isolated, descriptive tests; use `@vitest-environment jsdom` for DOM tests.
- **Exports:**
  - Prefer named exports. If default export is used, it must be explicit and documented.
- **Other:**
  - Avoid side effects in shared modules.
  - Favor functional/pure patterns, minimal global state.

## Additional notes
- No Cursor, Copilot, ESLint, or Prettier rules were found in this repo.
- All contributions should follow these style and workflow conventions.
