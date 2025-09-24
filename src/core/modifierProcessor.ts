import { applyAttributes } from "./attributeManager";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";

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
