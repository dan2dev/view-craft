import {isPrimitive} from "../utility/isPrimitive";
import {createTagAttributes} from "./attributeHelpers";

export function isNode<T>(value: T): value is T & Node {
  return value instanceof Node;
}

export function isNotNullObject<T>(value: T): value is T & object {
  return typeof value === "object" && value !== null;
}

export function handleMod<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  mod: NodeMod<TTagName> | NodeModFn<TTagName>,
  iMod: number,
): void {
  if (mod == null) return;
  if (typeof mod === "function") {
    mod = (mod as NodeModFn<TTagName>)(element, iMod);
    if (mod == null) return;
  }
  if (isPrimitive(mod)) {
    element.appendChild?.(document.createTextNode(String(mod)));
  } else if (isNode(mod)) {
    element.appendChild?.(mod);
  } else if (isNotNullObject(mod)) {
    if ("tagName" in mod) {
      element.appendChild?.(mod as HTMLElement);
    } else {
      createTagAttributes(element, mod as ExpandedElementAttributes<TTagName>);
    }
  }
}
