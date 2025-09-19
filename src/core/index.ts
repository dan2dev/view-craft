import { tags } from "./tags";

const isPrimitive = (val: unknown): val is string | number | boolean => {
  return typeof val === "string" || typeof val === "number" || typeof val === "boolean";
};

const createTagAttributes = <TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attrs: ExpandedElementAttributes<TTagName>,
) => {
  for (const key in attrs) {
    let value: unknown = attrs[key];
    if (typeof value === "function") {
      value = value();
    }
    if (value == null) continue;
    if (key in element) {
      // @ts-ignore
      element[key] = value;
    } else if (element instanceof Element) {
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
          createTagAttributes(element, mod as ExpandedElementAttributes<TTagName>);
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
console.time("-----tags creation-----");
tags.forEach((tag) => {
  // @ts-ignore
  globalThis[tag] = createTag(tag);
});
console.timeEnd("-----tags creation-----");
