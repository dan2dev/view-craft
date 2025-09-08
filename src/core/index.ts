import isBrowser from "../utility/isBrowser";
import { tags } from "./tags";

// const exportTags = {} as unknown;


export const createTag =
  <TTagName extends ElementTagName = ElementTagName>(tagName: TTagName) =>
    (...mods: NodeMod<ElementTagName>[]) => {
      return ((parent: ExpandedElement<ElementTagName>, index: number) => {
        const element = document.createElement(tagName) as ExpandedElement<ElementTagName>;
        element.rawMods = mods || [];
        element.mods = element.rawMods.map((mod, modIndex) => {
          if (typeof mod === "function") {
            return mod(element, modIndex);
          }
          return mod;
        });
        element.mods.forEach((mod, index) => {
          const type = typeof mod;
          if (type === "object") {
            if (mod instanceof HTMLElement) {
              element.appendChild?.(mod as HTMLElement);
            } else {
              // here is the attributes
              Object.entries(mod as ExpandedElement).forEach(([key, value]) => {
                if (key === "rawMods" || key === "mods") {
                  return;
                }
                let v: unknown | undefined;;
                if (typeof value === "function") {
                  v = value(element, index);
                  if (v !== undefined) {
                    // @ts-ignore
                    element[key] = v;
                  }
                } else {
                  // @ts-ignore
                  element[key] = value;
                }
              });
            }
          } else if (type !== "string") {
            const content = String(mod);
            if (isBrowser) {
              const text = document.createTextNode(content);
              element.appendChild?.(text);
            } else {
              element.appendChild?.(content as any);
            }
          } else {
            const content = mod as string;
            if (isBrowser) {
              const text = document.createTextNode(content);
              element.appendChild?.(text);
            } else {
              element.appendChild?.(content as any);
            }
          }
        });
        return element;
      }) as NodeMod<ElementTagName>;
    };

tags.forEach((tag) => {
  // @ts-ignore
  globalThis[tag] = createTag(tag);
});
