import type { Feature } from '../types/content';

export const highlights: Feature[] = [
  {
    title: 'Explicit updates',
    description: 'Mutate state, call update(), and know exactly when the DOM changes—no surprise renders, ever.',
  },
  {
    title: 'Native DOM',
    description: 'Compose real elements with fluent helpers. ViewCraft talks to the platform directly instead of simulating it.',
  },
  {
    title: 'Tiny footprint',
    description: 'Stay lightweight. ViewCraft delivers a compact runtime that fits into performance-focused bundles.',
  },
  {
    title: 'Global API',
    description: 'Import once to register 140+ HTML and SVG tag helpers globally. They are ready wherever you build.',
  },
  {
    title: 'TypeScript-first',
    description: 'Tag helpers, attributes, and events ship with deep TypeScript definitions so your editor guides every step.',
  },
  {
    title: 'Real reactivity',
    description: 'Fine-grained diffing ensures only changed nodes update, keeping interaction costs low and predictable.',
  },
];
