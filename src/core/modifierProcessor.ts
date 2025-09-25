import { applyAttributes } from "./attributeManager";
import { createReactiveTextNode } from "./reactive";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";

/**
 * Checks if a function returns a boolean value
 */
function isBooleanFunction(fn: Function): boolean {
  try {
    const result = fn();
    return typeof result === "boolean";
  } catch {
    return false;
  }
}

/**
 * Checks if a modifier should be treated as a conditional boolean function
 * based on the context of other modifiers
 */
export function isConditionalModifier(
  modifier: any, 
  allModifiers: any[],
  currentIndex: number
): modifier is () => boolean {
  if (!isFunction(modifier) || modifier.length !== 0 || !isBooleanFunction(modifier)) {
    return false;
  }

  // Get other modifiers (excluding the current one)
  const otherModifiers = allModifiers.filter((_, index) => index !== currentIndex);
  
  // If there are no other modifiers, it's not conditional
  if (otherModifiers.length === 0) {
    return false;
  }

  // If any other modifier is an object (attributes) or element, it's likely conditional
  const hasAttributesOrElements = otherModifiers.some(mod => 
    isObject(mod) || isNode(mod) || (isFunction(mod) && (mod as Function).length > 0)
  );

  if (hasAttributesOrElements) {
    return true;
  }

  // If all other modifiers are primitives or primitive functions, 
  // it's likely reactive text content, not conditional rendering
  return false;
}

/**
 * Finds the first conditional modifier in the array and returns its index
 */
export function findConditionalModifier(modifiers: any[]): number {
  for (let i = 0; i < modifiers.length; i++) {
    if (isConditionalModifier(modifiers[i], modifiers, i)) {
      return i;
    }
  }
  return -1;
}

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
