# view-craft

A lightweight, declarative DOM micro‑view layer with:
- Global tag builders
- Fine‑grained conditional rendering (`when`)
- Diff–free list synchronization (`list`)
- Reactive text / attributes
- Explicit `update()` loop (you stay in control)

---

# Installation
```bash
npm install view-craft
```

## Setup

Add the following to your TypeScript configuration types:
```
{
  "compilerOptions": {
    "types": [
      "view-craft/types"
    ]
  }
}
```
Alternatively, you can add the following on `vite-env.d.ts`
```typescript
/// <reference types="vite/client" />
/// <reference types="view-craft/types" />
```

# Quick Start
```ts
import { initializeRuntime, update, list, when } from 'view-craft';

initializeRuntime();

let items = [1, 2, 3];
let show = true;

const ui = div(
  when(() => show,
    h1('Numbers'),
    list(
      () => items,
      n => div(`Item: ${n}`, { className: 'row' })
    ),
    h2('End')
  ).else(
    h1('Hidden')
  )
);

ui(document.body, 0);

// mutate data then
items.push(4);
update();
```

All HTML tag builders become globals once initialized and you can also import helpers directly.

---

## Conditional Rendering with `when`

`when` lets you declaratively define prioritized branches:

```ts
const view = when(
  () => user.role === 'admin',
  h1('Admin'), h2('Dashboard')
)
.when(
  () => user.role === 'user',
  h1('User'), h2('Home')
)
.else(
  h1('Guest'), h2('Sign in required')
);

view(container, 0);
update(); // if conditions rely on reactive sources
```

### Multiple content items
Each branch (`when(...)` / `.else(...)`) can contain any number of modifiers:
- Primitive values
- Element factory NodeModFns (e.g. `h1(...)`)
- Attribute objects
- Zero‑arg reactive functions (returning primitives)
- Structural modifiers (`list`, nested `when`)

### Branch evaluation rules
1. Branches are checked in the order they were declared.
2. First truthy `when` branch wins.
3. If none match and an `else` branch exists, it renders.
4. When the active branch does not change between updates:
   - Existing DOM is preserved
   - Reactive text / attribute nodes still update via the global `update()` cycle
   - Structural runtimes (like `list`) are not destroyed/recreated

---

## Structural vs Simple Modifiers (Important Concept)

Inside a `when` branch, modifiers fall into two categories:

| Kind          | Example                          | How it behaves internally                                 |
|---------------|----------------------------------|-----------------------------------------------------------|
| Simple        | `h1('Title')`                    | Returns a detached element; `when` inserts it             |
| Reactive text | `() => count` (returns primitive)| Becomes a tracked text node; updates on `update()`        |
| Structural    | `list(...)`, another `when(...)` | Creates its own markers & manages its internal DOM region |

You do not need to distinguish them manually. The runtime detects whether a returned node is already in the DOM:
- If NOT in the DOM → queued and inserted between the `when` markers
- If ALREADY in the DOM → treated as self‑managed (no duplicate insertion)

This allows mixing:

```ts
when(
  () => color === 'blue',
  h1('Blue Mode'),
  list(() => items, v => div(v)),
  h2('Footer')
).else(
  h1('Not Blue')
);
```

---

## Lists Inside `when`

Lists are preserved while the branch stays active:

```ts
let visible = true;
let items = [{ id: 1 }, { id: 2 }, { id: 3 }];

const block = when(
  () => visible,
  list(
    () => items,
    item => div(`ID: ${item.id}`, { 'data-id': item.id })
  )
).else(
  h1('Nothing here')
);

block(container, 0);
update();

// Reorder / mutate items
items.reverse();
update(); // elements reused – identity preserved

// Hide branch
visible = false;
update();

// Show again – list is recreated fresh
visible = true;
update();
```

---

## Nested `when`

```ts
let outer = true;
let inner = false;

const nested = when(
  () => outer,
  div(
    { id: 'outer' },
    when(
      () => inner,
      span('Inner ON')
    ).else(
      span('Inner OFF')
    )
  )
).else(
  div('Outer hidden')
);

nested(container, 0);
update();

inner = true;
update(); // Only inner content changes, outer element preserved
```

---

## Reactive Text & Attributes

Any zero‑arg function returning a primitive inside `when` becomes reactive:

```ts
let count = 0;
const view = when(
  () => true,
  h1(() => `Count: ${count}`)
);

view(container, 0);
update();

count = 5;
update(); // text updates without re-rendering the branch
```

---

## Performance Notes

- Branch change ⇒ old DOM cleared, new branch rendered.
- Branch unchanged ⇒ no DOM diffing performed for simple content; structural runtimes internally sync (e.g. `list`).
- Call `update()` after state mutations to propagate:
  - list synchronization
  - conditional evaluation
  - reactive text / attributes

For extremely frequent updates you can batch mutations before calling `update()`.

---

## API Summary (Condensed)

```ts
when(condition, ...content)
  .when(conditionB, ...contentB)
  .else(...elseContent)

list(() => items, (item, index) => /* element | NodeModFn */)

update(); // triggers all runtime synchronizations
```

---

## Best Practices

- Keep conditions pure (avoid side effects).
- Reuse object references for list item identity (e.g., mutate arrays, not objects, if you want element reuse).
- Prefer a single `update()` call after a batch of mutations.
- Use `.else()` even if initially unnecessary—it documents intent and simplifies future expansion.

---

## Debug Tips

- Use browser devtools to inspect comment markers:
  - `when-start-*` / `when-end`
  - `list-start-*` / `list-end`
- If content seems missing, confirm that `update()` is being called after changing underlying data.

---

## Roadmap (Potential Enhancements)

- Keyed list variant
- Async / deferred branch hydration
- Dev mode diagnostics overlay
- Built‑in transition helpers

---

## License

MIT
