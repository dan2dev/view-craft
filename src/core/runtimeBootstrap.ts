import { registerGlobalTagBuilders } from "./tagRegistry";
import { list } from "../list";
import { update } from "./updateController";
import { when } from "../when";
import { on } from "../utility/on";
import { registerGlobalStyleUtilities, w, h, bg, border, borderRadius, css, cn } from "../style";

/**
 * Initializes the View Craft runtime by exposing tag builders and list utilities.
 */
export function initializeRuntime(): void {
  registerGlobalTagBuilders();
  registerGlobalStyleUtilities();

  if (typeof globalThis !== "undefined") {
    const registry = globalThis as Record<string, unknown>;
    registry.list = list;
    registry.update = update;
    registry.when = when;
    registry.on = on;
    registry.w = w;
    registry.h = h;
    registry.bg = bg;
    registry.border = border;
    registry.borderRadius = borderRadius;
    registry.css = css;
    registry.cn = cn;
  }
}

if (typeof globalThis !== "undefined") {
  initializeRuntime();
}
