import { tags } from "./tags";

const isPrimitive = (val: unknown): val is string | number | boolean => {
  return typeof val === "string" || typeof val === "number" || typeof val === "boolean";
};
// const isVirtualElement = (val: object): val is { tagName: string } => {
//   return 'tagName' in val;
// };

const createTagAttributes = <TTagName extends ElementTagName>(element: ExpandedElement<TTagName>, attrs: Record<string, unknown>) => {

}
/**
 * Factory that creates strongly typed element builder functions.
 * Usage: const el = div("text", { id: "foo" })(parent, 0)
 */
const createTagReturn = <TTagName extends ElementTagName>(tagName: TTagName, ...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]) => {
  return ((parent: ExpandedElement<TTagName>, index: number) => {
    type ElementType = ExpandedElement<TTagName>;
    const element: ElementType = document.createElement(tagName) as ElementType;

    for (let iMod = 0; iMod < rawMods.length; iMod++) {
      if (rawMods[iMod] == null || rawMods[iMod] === undefined) continue;
      let mod = rawMods[iMod];
      // if is a function evaluate it
      if (typeof mod === 'function') {
        mod = (mod as NodeModFn<TTagName>)(element, iMod);
      }
      // ---------------------------
      // if is object (Element or attributes)
      if (typeof mod === 'object' && mod !== null) {
        if ('tagName' in mod) {
          // Handle virtual element
        } else {
          // Handle attributes
          createTagAttributes(element, mod as Record<string, unknown>);
        }
      } else {

      }

      // primitive
      // if (isPrimitive(mod)) {

      // } else if (isVirtualElement(mod)) {

      // }

    }
    // // Keep original (possibly unevaluated) modifiers
    // element.rawMods = rawMods;

    // // Evaluate function mods immediately so they become static for this element instance
    // element.mods = rawMods.map(
    //   (m, i) => (typeof m === "function" ? (m as NodeModFn<TTagName>)(element, i) : m),
    // );

    // // Helpers -------------------------------------------------------------
    // const appendPrimitive = (value: Primitive) => {
    //   const content = String(value);
    //   if (isBrowser && typeof document !== "undefined") {
    //     element.appendChild?.(document.createTextNode(content));
    //   } else {
    //     element.appendChild?.(content as any);
    //   }
    // };

    // const applyAttributes = (attrs: Record<string, unknown>) => {
    //   Object.entries(attrs).forEach(([key, value]) => {
    //     if (key === "rawMods" || key === "mods") return; // internal bookkeeping
    //     // Support attribute value functions (called lazily with element + index if they accept args)
    //     // eslint-disable-next-line @typescript-eslint/ban-types
    //     if (typeof value === "function") {
    //       try {
    //         // Attempt calling with (element) first; fallback to no-arg
    //         const maybe = (value as any).length > 0 ? (value as any)(element) : (value as any)();
    //         if (maybe !== undefined) {
    //           // @ts-ignore dynamic assignment
    //           element[key] = maybe;
    //         }
    //       } catch {
    //         // Ignore attribute function errors silently for now (could log later)
    //       }
    //     } else if (value !== undefined) {
    //       // @ts-ignore dynamic assignment
    //       element[key] = value;
    //     }
    //   });
    // };

    // const appendNode = (val: unknown) => {
    //   if (val == null) return;
    //   if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    //     appendPrimitive(val as Primitive);
    //     return;
    //   }
    //   if (isBrowser && val instanceof HTMLElement) {
    //     element.appendChild?.(val);
    //     return;
    //   }
    //   if (typeof val === "object") {
    //     // Treat plain objects (non-HTMLElement) as attribute bags
    //     applyAttributes(val as Record<string, unknown>);
    //     return;
    //   }
    //   // Fallback: coerce to string
    //   appendPrimitive(String(val));
    // };

    // // Process evaluated modifiers
    // element.mods = rawMods.map(
    //   (m, i) => (typeof m === "function" ? (m as NodeModFn<TTagName>)(element, i) : m),
    // );

    return element;
  }) as NodeModFn<TTagName>;
}

export const createTag = <TTagName extends ElementTagName>(tagName: TTagName) =>
  (...rawMods: ExpandedElement<TTagName>[]): NodeModFn<TTagName> => createTagReturn(tagName, ...rawMods);

// Register global tag builders ----------------------------------
tags.forEach((tag) => {
  // @ts-ignore
  globalThis[tag] = createTag(tag);
});
