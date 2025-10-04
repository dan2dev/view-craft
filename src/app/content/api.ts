import type { ApiItem } from '../types/content';

export const coreFunctions: ApiItem[] = [
  {
    name: 'update()',
    signature: 'update(): void',
    description: 'Triggers all reactive updates. Call this after mutating state. That\'s it. That\'s the whole API.',
    notes: 'Batch mutations like a responsible adult, then update once. Your browser\'s repaint budget will thank you.',
  },
  {
    name: 'render()',
    signature: 'render(node: NodeChild, target?: HTMLElement): void',
    description: 'Mounts your app into the DOM. Defaults to #app if you don\'t specify a target.',
    notes: 'Call once at startup. The tree stays live and responds to update() calls.',
  },
  {
    name: 'list()',
    signature: 'list(() => items, (item, index) => ...)',
    description: 'Synchronizes an array to DOM elements. Items are tracked by object identity (not keys).',
    notes: 'Mutate the array (push, splice, reverse), then call update(). Elements are reused if references stay the same.',
  },
  {
    name: 'when()',
    signature: 'when(() => condition, ...content)',
    description: 'Conditional rendering with chaining. First matching condition wins.',
    notes: 'DOM is preserved if the active branch doesn\'t change. Perfect for loading/empty/ready states.',
  },
  {
    name: 'on()',
    signature: "on('click', (e) => { ... }, options?)",
    description: 'Attaches event listeners with automatic cleanup.',
    notes: 'Supports all native options like passive, capture, once. Teardown is automatic.',
  },
];
