import { tags } from "./tags";

const isPrimitive = (val: unknown): val is string | number | boolean => {
  return typeof val === "string" || typeof val === "number" || typeof val === "boolean";
};
// const isVirtualElement = (val: object): val is { tagName: string } => {
//   return 'tagName' in val;
// };

const createTagAttributes = <TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attrs: Record<string, unknown>,
) => {
  // Set properties and attributes
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null) continue;
    // Prefer property when available, else set attribute
    if (key in element) {
      // @ts-ignore
      element[key] = value;
    } else if (element instanceof Element) {
      // Attributes as strings
      element.setAttribute?.(key, value.toString());
    }
  }
};
/**
 * Factory that creates strongly typed element builder functions.
 * Usage: const el = div("text", { id: "foo" })(parent, 0)
 */
const createTagReturn = <TTagName extends ElementTagName>(
  tagName: TTagName,
  ...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]
) => {
  return ((parent: ExpandedElement<TTagName>, index: number) => {
    type ElementType = ExpandedElement<TTagName>;
    const element: ElementType = document.createElement(tagName) as ElementType;

    for (let iMod = 0; iMod < rawMods.length; iMod++) {
      let mod = rawMods[iMod];
      if (mod == null) continue;
      if (typeof mod === "function") {
        mod = (mod as NodeModFn<TTagName>)(element, iMod);
        if (mod == null) continue;
      }
      if (isPrimitive(mod)) {
        element.appendChild?.(document.createTextNode(String(mod)));
      } else if (mod instanceof Node) {
        element.appendChild?.(mod);
      } else if (typeof mod === "object" && mod !== null) {
        if ("tagName" in mod) {
          element.appendChild?.(mod as HTMLHtmlElement);
        } else {
          createTagAttributes(element, mod as Record<string, unknown>);
        }
      }
      // null and undefined already skipped
    }
    return element;
  }) as NodeModFn<TTagName>;
};

export const createTag =
  <TTagName extends ElementTagName>(tagName: TTagName) =>
  (...rawMods: ExpandedElement<TTagName>[]): NodeModFn<TTagName> =>
    createTagReturn(tagName, ...rawMods);

// Register global tag builders ----------------------------------
tags.forEach((tag) => {
  // @ts-ignore
  globalThis[tag] = createTag(tag);
});
