import { applyAttributes } from "./attributeManager";
import { createReactiveTextNode } from "./reactive";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";
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

  // Check if this is a zero-argument function (reactive text) before treating as NodeModFn
  if (isFunction(modifier) && modifier.length === 0) {
    try {
      const testValue = (modifier as () => unknown)();
      if (isPrimitive(testValue) && testValue != null) {
        return createReactiveTextNode(modifier as () => Primitive);
      }
      // If the function returns null/undefined, ignore it completely
      return null;
    } catch (error) {
      console.error("Error evaluating reactive text function:", error);
      // Return a text node with empty content if the function throws
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
