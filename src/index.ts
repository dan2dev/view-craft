export { initializeRuntime } from "./core/runtimeBootstrap";
export {
  registerGlobalTagBuilders,
  HTML_TAGS,
  SVG_TAGS,
  SELF_CLOSING_TAGS,
} from "./core/tagRegistry";
export { createElementFactory, createTagBuilder } from "./core/elementFactory";
export { applyNodeModifier } from "./core/modifierProcessor";
export {
  list,
} from "./list";
export { when } from "./when";
export { update } from "./core/updateController";
export { applyAttributes } from "./core/attributeManager";
export { appendChildren } from "./utility/dom";
export { on } from "./utility/on";
export {
  isBoolean,
  isFunction,
  isNode,
  isObject,
  isPrimitive,
  isTagLike,
} from "./utility/typeGuards";
export { isBrowser } from "./utility/environment";

// Export styling utilities
export { w, h, bg, border, borderRadius, css, cn, registerGlobalStyleUtilities } from "./style";

// Auto-initialize when the module is loaded.
import "./core/runtimeBootstrap";
// Register styling utilities globals at import time
import "./style";
