import { isPrimitive } from "../utility/isPrimitive";
import { createTagAttributes } from "./attributeHelpers";

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
  } else if (mod instanceof Node) {
    element.appendChild?.(mod);
  } else if (typeof mod === "object" && mod !== null) {
    if ("tagName" in mod) {
      element.appendChild?.(mod as HTMLElement);
    } else {
      createTagAttributes(element, mod as ExpandedElementAttributes<TTagName>);
    }
  }
}
