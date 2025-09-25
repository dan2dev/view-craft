import { applyAttributes } from "./attributeManager";
import { createReactiveTextNode } from "./reactive";
import { logError } from "../utility/errorHandler";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";
import { modifierProbeCache } from "../utility/modifierPredicates";
export { isConditionalModifier, findConditionalModifier } from "../utility/modifierPredicates";

/**
 * Applies a modifier to the parent element and returns any rendered node.
 */
export function applyNodeModifier<TTagName extends ElementTagName>(
  parent: ExpandedElement<TTagName>,
  modifier: NodeMod<TTagName> | NodeModFn<TTagName>,
  index: number,
): Node | null {

  if (modifier == null) {
    return null;
  }

  // Zero-arg function branch (reactive text or side-effect function)
  // Use probe cache so we don't execute user functions twice (classification + application)
  if (isFunction(modifier) && modifier.length === 0) {
    try {
      let record = modifierProbeCache.get(modifier as Function);
      if (!record) {
        const value = (modifier as () => unknown)();
        record = { value, error: false };
        modifierProbeCache.set(modifier as Function, record);
      }

      if (record.error) {
        return createReactiveTextNode(() => "");
      }

      const testValue = record.value;
      if (isPrimitive(testValue) && testValue != null) {
        // Create reactive text node; we will still call original function for live updates
        return createReactiveTextNode(modifier as () => Primitive, testValue);
      }
      // null / undefined → ignore silently
      return null;
    } catch (error) {
      modifierProbeCache.set(modifier as Function, { value: undefined, error: true });
      logError("Error evaluating reactive text function:", error);
      return createReactiveTextNode(() => "");
    }
  }

  const candidate = isFunction(modifier)
    ? (modifier as NodeModFn<TTagName>)(parent, index)
    : (modifier as NodeMod<TTagName>);

  if (candidate == null) {
    return null;
  }

  if (isPrimitive(candidate)) {
    return document.createTextNode(String(candidate));
  }

  if (isNode(candidate)) {
    return candidate;
  }

  if (isObject(candidate)) {
    applyAttributes(parent, candidate as ExpandedElementAttributes<TTagName>);
  }

  return null;
}
