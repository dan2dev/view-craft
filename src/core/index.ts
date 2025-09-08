import { isBrowser } from "../utility/isBrowser";
import { tags } from "./tags";

/**
 * Factory that creates strongly typed element builder functions.
 * Usage: const el = div("text", { id: "foo" })(parent, 0)
 */
export const createTag = <TTagName extends ElementTagName>(tagName: TTagName) =>
  (...mods: NodeMod<TTagName>[]): NodeModFn<TTagName> => {
    return ((parent: ExpandedElement<TTagName>, _index: number) => {
      const element = (document?.createElement
        ? document.createElement(tagName)
        : { tagName }) as ExpandedElement<TTagName>;

      // Keep original (possibly unevaluated) modifiers
      (element as ExpandedElement<TTagName>).rawMods = mods;

      // Evaluate function mods immediately so they become static for this element instance
      const evaluatedMods: (Primitive | ExpandedElement | ElementAttributes<TTagName>)[] = mods.map(
        (m, i) => (typeof m === "function" ? (m as NodeModFn<TTagName>)(element, i) : m),
      );
      (element as ExpandedElement<TTagName>).mods = evaluatedMods;

      // Helpers -------------------------------------------------------------
      const appendPrimitive = (value: Primitive) => {
        const content = String(value);
        if (isBrowser && typeof document !== "undefined") {
          element.appendChild?.(document.createTextNode(content));
        } else {
          element.appendChild?.(content as any);
        }
      };

      const applyAttributes = (attrs: Record<string, unknown>) => {
        Object.entries(attrs).forEach(([key, value]) => {
          if (key === "rawMods" || key === "mods") return; // internal bookkeeping
          // Support attribute value functions (called lazily with element + index if they accept args)
            // eslint-disable-next-line @typescript-eslint/ban-types
          if (typeof value === "function") {
            try {
              // Attempt calling with (element) first; fallback to no-arg
              const maybe = (value as any).length > 0 ? (value as any)(element) : (value as any)();
              if (maybe !== undefined) {
                // @ts-ignore dynamic assignment
                element[key] = maybe;
              }
            } catch {
              // Ignore attribute function errors silently for now (could log later)
            }
          } else if (value !== undefined) {
            // @ts-ignore dynamic assignment
            element[key] = value;
          }
        });
      };

      const appendNode = (val: unknown) => {
        if (val == null) return;
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
          appendPrimitive(val as Primitive);
          return;
        }
        if (isBrowser && val instanceof HTMLElement) {
          element.appendChild?.(val);
          return;
        }
        if (typeof val === "object") {
          // Treat plain objects (non-HTMLElement) as attribute bags
          applyAttributes(val as Record<string, unknown>);
          return;
        }
        // Fallback: coerce to string
        appendPrimitive(String(val));
      };

      // Process evaluated modifiers
      evaluatedMods.forEach(appendNode);

      return element;
    }) as unknown as NodeModFn<TTagName>;
  };

// Register global tag builders (only once) ----------------------------------
tags.forEach((tag) => {
  // Avoid overwriting if already defined
  if (!(globalThis as any)[tag]) {
    // @ts-ignore - augmenting global scope intentionally
    globalThis[tag] = createTag(tag);
  }
});
