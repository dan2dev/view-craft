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
) => {};
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
      if (rawMods[iMod] == null || rawMods[iMod] === undefined) continue;
      let mod = rawMods[iMod];
      // if is a function evaluate it
      if (typeof mod === "function") {
        mod = (mod as NodeModFn<TTagName>)(element, iMod);
      }
      // ---------------------------
      // if is object (Element or attributes)
      if (typeof mod === "object" && mod !== null) {
        if ("tagName" in mod) {
          // Handle virtual element
          element.appendChild?.(mod as HTMLHtmlElement);
        } else {
          // Handle attributes
          createTagAttributes(element, mod as Record<string, unknown>);
        }
      } else {
        // ---------------------------
      }
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
