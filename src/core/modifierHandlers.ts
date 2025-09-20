import { isPrimitive } from "../utility/isPrimitive";
import { createTagAttributes } from "./attributeHelpers";

export const handleMod = <TTagName extends keyof HTMLElementTagNameMap>(
  element: Partial<HTMLElementTagNameMap[TTagName]> & { [key: string]: unknown },
  mod: unknown,
  iMod: number,
) => {
  if (mod == null) return;
  if (typeof mod === "function") {
    mod = (mod as (el: typeof element, idx: number) => unknown)(element, iMod);
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
      createTagAttributes(element, mod as any);
    }
  }
};
