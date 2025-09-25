/**
 * Simplified environment detection - minimal overhead for smaller bundle size
 */

// Basic environment detection - no complex caching or edge cases
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
export const hasDOM = isBrowser && typeof document.createElement === 'function';
export const isSSR = typeof process !== 'undefined' && process.versions?.node != null;