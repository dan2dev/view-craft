# view-craft



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
import { initializeRuntime } from 'view-craft';

initializeRuntime();
```

All HTML tag builders become globals once initialized and you can also import helpers directly:

```ts
import { createDynamicListRenderer, update } from 'view-craft';

const items = [1, 2, 3];
const renderItems = createDynamicListRenderer(items, (value) => div(value));

renderItems(document.body, 0);

items.push(4);
update();

// Whenever your underlying data changes, call update() to refresh lists and reactive attributes.
```
