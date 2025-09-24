import { registerGlobalTags } from "./tags";
import { list, update } from "./dynamic-list";

/**
 * Initializes view-craft by registering all global tag builder functions
 */
export function start(): void {
  registerGlobalTags();

  // Register global list functions
  if (typeof globalThis !== "undefined") {
    // @ts-ignore
    globalThis.list = list;
    // @ts-ignore
    globalThis.update = update;
  }
}

// Auto-start if not explicitly controlled
if (typeof globalThis !== "undefined") {
  start();
}