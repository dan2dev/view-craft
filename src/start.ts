import { registerGlobalTags } from "./tags";

/**
 * Initializes view-craft by registering all global tag builder functions
 */
export function start(): void {
  registerGlobalTags();
}

// Auto-start if not explicitly controlled
if (typeof globalThis !== "undefined") {
  start();
}