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
  createDynamicListRenderer,
} from "./list";
export { update } from "./core/updateController";
export { applyAttributes } from "./core/attributeManager";
export { appendChildren } from "./utility/dom";
export {
  isBoolean,
  isFunction,
  isNode,
  isObject,
  isPrimitive,
  isTagLike,
} from "./utility/typeGuards";
export { isBrowser } from "./utility/environment";

// Auto-initialize when the module is loaded.
import "./core/runtimeBootstrap";
