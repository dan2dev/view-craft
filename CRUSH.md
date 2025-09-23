# CRUSH.md — view-craft agentic coding guide

## Build, Test & Type Commands
- `pnpm build` — Clean build with Rollup + TypeScript declarations
- `pnpm dev` — Development mode with watch (Rollup + TypeScript)
- `pnpm test` — Run all tests with Vitest
- `pnpm test -- test/path/to/file.test.ts` — Run specific test file
- `pnpm test -t "test name"` — Run specific test by name
- `pnpm exec tsc --noEmit` — Type check without emitting files

## Code Style
- **Imports:** ES Modules only, relative paths in `/src`, omit extensions
- **Format:** 2-space indent, double quotes, trailing commas when multiline
- **Types:** TypeScript strict mode, explicit types for params/returns, use generics
- **Naming:** `camelCase` for vars/functions, `PascalCase` for types/classes
- **Files:** Use `kebab-case` or `lowercase` for filenames
- **Testing:** Vitest with `@vitest-environment jsdom` for DOM tests
- **Exports:** Prefer named exports, document any default exports
- **Patterns:** Functional/pure code, minimal global state, no side effects

## Project Context
- **Library:** DOM element builder with functional API and TypeScript
- **Structure:** `src/core/` (element creation), `src/utility/` (helpers), `types/` (global types)
- **Environments:** Works in browser (real DOM) and Node.js (virtual DOM for SSR)
- **No linter:** No ESLint/Prettier config found — follow existing code patterns

## Notes
- Check CLAUDE.md for detailed architecture overview
- No Cursor/Copilot rules found in this repository
