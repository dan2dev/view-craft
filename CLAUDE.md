# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build:**
- `pnpm build` — Clean build with Rollup + TypeScript declarations
- `pnpm dev` — Development mode with watch (Rollup + TypeScript)
- `pnpm build:watch` — Watch mode for both Rollup and TypeScript

**Testing:**
- `pnpm test` — Run all tests with Vitest
- `pnpm test -- src/path/to/file.test.ts` — Run specific test file
- `pnpm test -t "test name"` — Run specific test by name

**Type Checking:**
- `pnpm exec tsc --noEmit` — Type check without emitting files

**Publishing:**
- `make publish` — Build, version bump (patch), and publish to npm

## Architecture Overview

**view-craft** is a TypeScript library for creating DOM elements with a functional, strongly-typed API. It provides global HTML tag builder functions that work in both browser and server environments.

### Core Architecture

**Element Creation System (`src/core/`):**
- `virtualDom.ts` — Virtual DOM implementation with `VElement` class for server-side rendering
- `index.ts` — Core element creation logic with `createTag` and `createTagReturn` factories
- `tags.ts` — Comprehensive list of HTML and SVG tag names

**Type System (`types/index.d.ts`):**
- Global type declarations for all HTML tags as strongly-typed builder functions
- Complex generic types for element attributes, modifiers, and builder patterns
- Separate handling for self-closing tags vs. container elements

**Key Design Patterns:**
1. **Global Tag Builders:** All HTML tags (div, span, etc.) are registered as global functions
2. **Modifier System:** Elements accept text, attributes, child elements, or functions as "modifiers"
3. **Universal Compatibility:** Works in browser (real DOM) and Node.js (virtual DOM)
4. **Type Safety:** Full TypeScript support with element-specific attribute types

### Core Concepts

**Element Builders:** Each HTML tag becomes a global function:
```typescript
div("Hello", { id: "container" })(parent, index) // Returns HTMLDivElement
```

**Modifiers:** Flexible parameter system accepting:
- Primitives (string, number, boolean) → text content
- Objects → attributes 
- Elements → child elements
- Functions → dynamic modifiers

**Dual Environment:** 
- Browser: Creates real DOM elements
- Server: Creates virtual elements for SSR

### Project Structure

```
src/
├── index.ts          # Main entry point, exports start()
├── some.ts           # Utility functions
├── core/
│   ├── index.ts      # Element creation system
│   ├── virtualDom.ts # Virtual DOM for SSR
│   └── tags.ts       # HTML/SVG tag definitions
└── utility/
    ├── index.ts      # Utility exports
    ├── isBrowser.ts  # Environment detection
    └── tags.ts       # Re-exports core tags

types/
└── index.d.ts        # Global type declarations
```

### Build System

- **Rollup** for bundling (ES, CJS, UMD formats)
- **TypeScript** for type declarations
- **Vitest** for testing with jsdom support
- **pnpm** for package management

## Code Style (from CRUSH.md)

- ES Modules with relative imports (no extensions)
- 2-space indentation, double quotes, trailing commas
- Strict TypeScript with explicit types
- camelCase variables, PascalCase types
- Minimal global state, prefer functional patterns
- Use `@vitest-environment jsdom` for DOM tests