import type { ApiItem } from '../types/content';

export const coreFunctions: ApiItem[] = [
  {
    name: 'update()',
    signature: 'update(): void',
    description: 'Triggers reactive bindings to sync the DOM. Call it after your state mutations.',
    notes: 'Group related mutations and invoke update() once so rendering stays efficient and predictable.',
  },
  {
    name: 'render()',
    signature: 'render(node: NodeChild, target?: HTMLElement): void',
    description: 'Mounts your app into the DOM. Defaults to #app when no target is provided.',
    notes: 'Render once during startup. Subsequent update() calls keep the tree in sync.',
  },
  {
    name: 'list()',
    signature: 'list(() => items, (item, index) => ...)',
    description: 'Synchronizes arrays with DOM elements. Items are tracked by reference rather than keys.',
    notes: 'Mutate the same array instance and call update()—existing nodes are efficiently reused.',
  },
  {
    name: 'when()',
    signature: 'when(() => condition, ...content)',
    description: 'Conditional rendering you can chain. The first truthy branch wins.',
    notes: 'ViewCraft preserves DOM nodes when the active branch remains the same, making it ideal for loading, empty, and ready states.',
  },
  {
    name: 'on()',
    signature: "on('click', (e) => { ... }, options?)",
    description: 'Attaches event listeners with automatic cleanup.',
    notes: 'Supports native listener options such as passive, capture, and once while managing teardown for you.',
  },
];
