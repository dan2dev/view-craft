/**
 * Detects if the code executes in a browser-like environment.
 */
export const isBrowser: boolean = typeof window !== "undefined" && typeof document !== "undefined";
