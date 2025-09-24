import { registerGlobalTagBuilders } from "./tagRegistry";
import { list } from "../list";
import { update } from "./updateController";

/**
 * Initializes the View Craft runtime by exposing tag builders and list utilities.
 */
export function initializeRuntime(): void {
  registerGlobalTagBuilders();

  if (typeof globalThis !== "undefined") {
    const registry = globalThis as Record<string, unknown>;
    registry.list = list;
    registry.update = update;
  }
}

if (typeof globalThis !== "undefined") {
  initializeRuntime();
}
