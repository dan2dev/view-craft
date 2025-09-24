import { registerGlobalTagBuilders } from "./tagRegistry";
import { createDynamicListRenderer, refreshDynamicLists } from "../list";

/**
 * Initializes the View Craft runtime by exposing tag builders and list utilities.
 */
export function initializeRuntime(): void {
  registerGlobalTagBuilders();

  if (typeof globalThis !== "undefined") {
    const registry = globalThis as Record<string, unknown>;
    registry.createDynamicListRenderer = createDynamicListRenderer;
    registry.refreshDynamicLists = refreshDynamicLists;
  }
}

if (typeof globalThis !== "undefined") {
  initializeRuntime();
}
