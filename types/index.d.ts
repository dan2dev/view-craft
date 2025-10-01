// Import all organized type definitions
import "./core/base";
import "./svg/base";
import "./html/tags";
import "./svg/tags";
import "./features/list";
import "./features/when";
import "./features/update";
import "./features/on";
import "./features/render";

// Re-export on() helper for module-style consumers (import { on } from "view-craft")
export function on<K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): NodeModFn<any>;
export function on<K extends string, E extends Event = Event>(
  type: K,
  listener: (ev: E) => any,
  options?: boolean | AddEventListenerOptions
): NodeModFn<any>;

export {};