import type { ApiItem } from '../types/content';

export const coreFunctions: ApiItem[] = [
  {
    name: 'update()',
    signature: 'update(): void',
    description: 'Flushes every reactive function registered in the tree. Call after mutating state.',
    notes: 'Batch several mutations and call update() once for predictable performance.',
  },
  {
    name: 'render()',
    signature: 'render(node: NodeChild, target?: HTMLElement): void',
    description: 'Mounts a node into the DOM. Defaults to #app when no target is supplied.',
    notes: 'Call once at startup; the returned tree stays live and responds to update().',
  },
  {
    name: 'list()',
    signature: 'list(provider, renderer)',
    description: 'Keeps DOM nodes in sync with an array based on object identity.',
    notes: 'Mutate the original array (push, splice, sort) and call update().',
  },
  {
    name: 'when()',
    signature: 'when(condition, ...content).when(...).else(...)',
    description: 'Declarative branching that only swaps DOM when the active branch changes.',
    notes: 'Perfect for loading + empty + ready states without unmount jitter.',
  },
  {
    name: 'on()',
    signature: "on(event: string, handler: (ev: Event) => void, options?)",
    description: 'Attaches listeners while preserving context and teardown automatically.',
    notes: 'Supports native options like passive or capture.',
  },
];
