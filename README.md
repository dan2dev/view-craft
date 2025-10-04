# view-craft

**A lightweight reactive DOM library for developers who prefer control.**

ViewCraft keeps the DOM close to the surface: import once, mutate state with plain objects, call `update()` when you're ready, and let the library synchronize your UI without hidden layers.

## Development & Deployment

### Local Development

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server with HMR
pnpm build      # Build for production
pnpm preview    # Preview production build
```

### Deploy to GitHub Pages

Build and deploy locally to GitHub Pages:

```bash
pnpm deploy
```

This will:
1. Build the project locally with `pnpm build`
2. Switch to the `gh-pages` branch
3. Replace content with the new build
4. Commit and push to GitHub
5. Return you to your original branch

For more details, see [`scripts/README.md`](scripts/README.md).

---

```ts
import 'view-craft';

let count = 0;

const counter = div(
  h1(() => `Count: ${count}`),
  button('Increment', on('click', () => {
    count++;
    update();
  }))
);

render(counter);
```

## Why view-craft?

- **Explicit updates** – Call `update()` after state changes and decide exactly when the DOM synchronizes.
- **Native DOM** – Compose real elements with fluent helpers; there is no virtual DOM layer to manage.
- **Tiny footprint** – A compact runtime that keeps performance-sensitive bundles lean.
- **Global API** – Import once to register 140+ HTML and SVG helpers globally across your project.
- **TypeScript-first** – Comprehensive type coverage for tags, attributes, and events ensures confident refactors.
- **Real reactivity** – Only changed nodes update, keeping interactions smooth without extra bookkeeping.

---

## Installation

```bash
npm install view-craft
```

### Usage

Simply import once to register all global functions:

```ts
import 'view-craft';

// Now use div(), update(), on(), list(), when(), render(), etc. globally
let count = 0;
const app = div(
  h1(() => `Count: ${count}`),
  button('Click', on('click', () => { count++; update(); }))
);
render(app);
```

### TypeScript Setup

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["view-craft/types"]
  }
}
```

Or in your `vite-env.d.ts`:

```ts
/// <reference types="view-craft/types" />
```

---

## Quick Examples

### Counter

```ts
import 'view-craft';

let count = 0;

const app = div(
  h1(() => `Count: ${count}`),
  button('Increment', on('click', () => { count++; update(); })),
  button('Reset', on('click', () => { count = 0; update(); }))
);

render(app);
```

### Todo List

```ts
import 'view-craft';

type Todo = { id: number; text: string; done: boolean };

let todos: Todo[] = [];
let nextId = 1;
let input = '';

function addTodo() {
  if (!input.trim()) return;
  todos.push({ id: nextId++, text: input, done: false });
  input = '';
  update();
}

const app = div(
  { className: 'todo-app' },

  // Input
  div(
    input({ value: () => input },
      on('input', e => { input = e.target.value; update(); }),
      on('keydown', e => e.key === 'Enter' && addTodo())
    ),
    button('Add', on('click', addTodo))
  ),

  // List
  when(() => todos.length > 0,
    list(() => todos, (todo) =>
      div(
        { className: () => todo.done ? 'done' : '' },
        input({ type: 'checkbox', checked: () => todo.done },
          on('change', () => { todo.done = !todo.done; update(); })
        ),
        span(() => todo.text),
        button('×', on('click', () => {
          todos = todos.filter(t => t.id !== todo.id);
          update();
        }))
      )
    )
  ).else(
    p('No todos yet!')
  )
);

render(app);
```

### Real-time Search Filter

```ts
import 'view-craft';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
];

let searchQuery = '';

function filteredUsers() {
  const q = searchQuery.toLowerCase();
  return users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
}

const app = div(
  h1('User Directory'),

  input(
    {
      type: 'search',
      placeholder: 'Search users...',
      value: () => searchQuery
    },
    on('input', e => {
      searchQuery = e.target.value;
      update();
    })
  ),

  when(() => filteredUsers().length > 0,
    list(() => filteredUsers(), user =>
      div(
        { className: 'user-card' },
        h3(user.name),
        p(user.email)
      )
    )
  ).else(
    p(() => `No users found for "${searchQuery}"`)
  )
);

render(app);
```

### Loading States & Async

```ts
import 'view-craft';

type State = { status: 'idle' | 'loading' | 'error'; data: any[]; error?: string };

let state: State = { status: 'idle', data: [] };

async function fetchData() {
  state.status = 'loading';
  update();

  try {
    const response = await fetch('/api/data');
    state.data = await response.json();
    state.status = 'idle';
  } catch (err) {
    state.status = 'error';
    state.error = err.message;
  }
  update();
}

const app = div(
  button('Load Data', on('click', fetchData)),

  when(() => state.status === 'loading',
    div('Loading...')
  ).when(() => state.status === 'error',
    div({ className: 'error' }, () => `Error: ${state.error}`)
  ).when(() => state.data.length > 0,
    list(() => state.data, item => div(item.name))
  ).else(
    div('No data loaded')
  )
);

render(app);
```

---

## Core Concepts

### 1. **Explicit Updates**

ViewCraft relies on explicit updates. Mutate state however you need, then call `update()` once to flush the changes:

```ts
let name = 'World';

// Mutate freely
name = 'Alice';
name = name.toUpperCase();

// Update once when ready
update();
```

**Advantages of explicit `update()`:**

- **Performance**: Batch multiple mutations and flush once to minimize DOM work.
- **Control**: Decide exactly when pixels change—ideal for coordinating animations and async workflows.
- **Predictability**: No implicit re-renders; the DOM changes only when you call `update()`.
- **Simplicity**: No proxies or dependency graphs—just state and a single entry point for synchronization.
- **Debugging**: Set a breakpoint on `update()` to observe precisely when the view syncs.

```ts
// Example: Batch updates for better performance
items.push(item1);
items.push(item2);
items.sort();
user.name = 'Alice';
update();  // One update for all changes

// vs. automatic tracking (hypothetical)
items.push(item1);  // triggers update
items.push(item2);  // triggers update
items.sort();       // triggers update
user.name = 'Alice'; // triggers update
// 4 updates instead of 1!
```

### 2. **Reactive Functions**

Zero-arg functions become reactive:

```ts
let count = 0;

div(
  () => `Count: ${count}`,  // Updates when update() is called
  { title: () => `Current: ${count}` }  // Attributes too
)
```

### 3. **Conditional Rendering with `when`**

First matching condition wins:

```ts
when(() => user.isAdmin,
  div('Admin Panel')
).when(() => user.isLoggedIn,
  div('User Dashboard')
).else(
  div('Please log in')
)
```

DOM is preserved if the active branch doesn't change.

### 4. **List Synchronization**

Lists use object identity (not keys) to track items:

```ts
list(() => items, (item, index) =>
  div(() => `${index}: ${item.name}`)
)
```

Mutate the array (push, splice, reverse), then call `update()`. Elements are reused if the item reference is the same.

## API Reference

### Core Functions

#### `update()`

Triggers all reactive updates. Call this after mutating state:

```ts
count++;
items.push(newItem);
update();
```

#### `list(provider, renderer)`

Synchronizes an array to DOM elements:

```ts
list(
  () => items,           // Provider function
  (item, index) => div(  // Renderer
    () => `${index}: ${item.name}`
  )
)
```

Items are tracked by object identity. Mutate the array and call `update()` to sync.

#### `when(condition, ...content)`

Conditional rendering with chaining:

```ts
when(() => count > 10,
  div('High')
).when(() => count > 0,
  div('Low')
).else(
  div('Zero')
)
```

First matching condition wins. DOM is preserved if the active branch doesn't change.

#### `on(event, handler, options?)`

Attach event listeners:

```ts
button('Click me',
  on('click', () => console.log('clicked')),
  on('mouseenter', handleHover, { passive: true })
)
```

### Tag Builders

All HTML and SVG tags are available globally:

```ts
div(), span(), button(), input(), h1(), p(), ul(), li()
svg(), circle(), path(), rect(), g()
// ... and 140+ more
```

### Attributes

Pass attributes as objects:

```ts
div('Hello', {
  className: 'container',
  id: 'main',
  'data-test': 'value',
  style: { color: 'red', fontSize: '16px' }
})
```

Reactive attributes use functions:

```ts
div({
  className: () => isActive ? 'active' : '',
  disabled: () => !isValid,
  style: () => ({ opacity: isVisible ? 1 : 0 })
})
```

---

## Best Practices

### Batch Updates

Mutate like you're stress-testing the array, then update once like you meant to do that:

```ts
// Galaxy brain
items.push(item1);
items.push(item2);
items.sort();
update();

// Smooth brain (but hey, it works)
items.push(item1);
update();
items.push(item2);
update();
```

### Object Identity for Lists

Lists track items by reference. Mutate the object, not your soul:

```ts
// The way
todos[0].done = true;
update();

// The dark side (RIP that DOM element, we hardly knew ye)
todos[0] = { ...todos[0], done: true };
update();
```

### Use `.else()` for Clarity

Even if not initially needed:

```ts
when(() => isLoading,
  div('Loading...')
).else(
  div('Ready')  // Clear intent
)
```

---

## Advanced Patterns

### Nested Structures

Combine `when` and `list`:

```ts
when(() => user.isLoggedIn,
  div(
    h1(() => `Welcome, ${user.name}`),
    list(() => user.notifications, n =>
      div(n.message, { className: () => n.read ? 'read' : 'unread' })
    )
  )
).else(
  div('Please log in')
)
```

### Component-like Functions

```ts
function UserCard(user: User) {
  return div(
    { className: 'user-card' },
    img({ src: user.avatar }),
    h3(user.name),
    p(user.bio)
  );
}

list(() => users, user => UserCard(user))
```

### Computed Values

```ts
function activeCount() {
  return todos.filter(t => !t.done).length;
}

div(
  () => `${activeCount()} remaining`
)
```

---

## Performance

- **No virtual DOM diffing** – ViewCraft interacts with the platform directly, reducing overhead.
- **Fine-grained updates** – Only bindings touched by your mutations re-render, keeping work minimal.
- **Element reuse** – list() reuses existing DOM nodes when item references stay stable.
- **Branch preservation** – `when` maintains inactive branches until conditions change for smooth toggles.

For high-frequency scenarios such as animations or data streams, group your mutations and call `update()` once per frame.

---

## Debugging

### Inspect Markers

Open DevTools and inspect the DOM tree:

```html
<!-- when-start-1 -->
<div>Content</div>
<!-- when-end -->

<!-- list-start-2 -->
<div>Item 1</div>
<div>Item 2</div>
<!-- list-end -->
```

These comment markers outline conditional and list boundaries so you can trace exactly what rendered.

### Common Issues

**Content not updating?**
- Confirm `update()` runs after your state changes.
- Log reactive functions to ensure they return the values you expect.

**List items not reusing elements?**
- Mutate existing objects so their references remain stable.
- Keep list data in a shared array instance instead of replacing it each render.

---

## Roadmap

- Keyed list variant for data that cannot preserve object references
- Transition and animation helpers for orchestrated UI feedback
- Dev-mode diagnostics that flag missing `update()` calls
- Server-side rendering support

---

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

This library is free and open source. When using view-craft, please include attribution in your documentation, application, or source code. See the [LICENSE.md](LICENSE.md) file for attribution examples.

**TL;DR:** Use it freely, just give credit. It helps others discover this library!
