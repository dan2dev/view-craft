# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build:**
- `pnpm build` — Clean build with Rollup + TypeScript declarations
- `pnpm dev` — Development mode with watch (Rollup + TypeScript)
- `pnpm build:watch` — Watch mode for both Rollup and TypeScript

**Testing:**
- `pnpm test` — Run all tests with Vitest and coverage
- `pnpm test:watch` — Run tests in watch mode
- `pnpm test -- src/path/to/file.test.ts` — Run specific test file
- `pnpm test -t "test name"` — Run specific test by name

**Type Checking:**
- `pnpm exec tsc --noEmit` — Type check without emitting files

**Publishing:**
- `make publish` — Build, version bump (patch), and publish to npm
- `pnpm clean` — Remove build artifacts and cache files

## Architecture Overview

**view-craft** is a TypeScript library for creating DOM elements with a functional, strongly-typed API. It provides global HTML tag builder functions that work in both browser and server environments.

### Core Architecture

**Element Creation System (`src/core/elementFactory.ts`):**
- `createElementFactory` — Creates element builders that return modifier functions
- `createTagBuilder` — Factory for generating tag-specific builder functions

**Type System (`types/index.d.ts`):**
- Global type declarations for all HTML tags as strongly-typed builder functions
- Complex generic types for element attributes, modifiers, and builder patterns
- Separate handling for self-closing tags vs. container elements

**Key Design Patterns:**
1. **Global Tag Builders:** All HTML tags (div, span, etc.) are registered as global functions
2. **Modifier System:** Elements accept text, attributes, child elements, or functions as "modifiers"
3. **Simplified Architecture:** All related functionality organized in focused, single-purpose files
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

**Browser Environment:**
- Creates real DOM elements using `document.createElement`
- Supports reactive attributes with event listeners

**Dynamic Lists (`src/list/renderer.ts`):**
- `createDynamicListRenderer(items, renderFn)` creates inline dynamic lists using DOM comment markers
- `update()` synchronizes dynamic lists and dispatches reactive update events
- Preserves existing DOM elements when reordering (no recreation)
- Maintains siblings and doesn't require wrapper containers
- Uses WeakMap for efficient tracking without memory leaks

### Project Structure

```
src/
├── core/
│   ├── attributeManager.ts   # Attribute handling and reactive updates
│   ├── elementFactory.ts     # Core element creation functions
│   ├── modifierProcessor.ts  # Modifier processing pipeline
│   ├── runtimeBootstrap.ts   # Global initialization logic
│   ├── updateController.ts   # Global update orchestration
│   └── tagRegistry.ts        # HTML/SVG tag definitions and registration
├── list/
│   ├── index.ts              # Dynamic list public surface
│   ├── renderer.ts           # Entry point for list builder functions
│   ├── runtime.ts            # List runtime management and synchronization
│   └── types.ts              # Shared list-specific types
├── utility/
│   ├── dom.ts                # DOM helper utilities
│   ├── environment.ts        # Runtime environment detection
│   └── typeGuards.ts         # Shared type guard helpers
└── index.ts                  # Main entry point with exports

types/
└── index.d.ts                # Global type declarations
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
