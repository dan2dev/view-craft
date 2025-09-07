import isBrowser from "../utility/isBrowser";
import { createElement, VElement } from "./virtualDom";

export const div: NodeBuilder<"div"> = (...mods: NodeMod<"div">[]) => {
  return ((parent: ExpandedElement<"div">, index: number) => {
    const element = createElement("div") as ExpandedElement<"div">;
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
        if (isBrowser && mod instanceof HTMLElement) {
          element.appendChild?.(mod as HTMLElement);
        } else {
          Object.entries(mod as ExpandedElement).forEach(([key, value]) => {
            if (key === "rawMods" || key === "mods") {
              return;
            }
            if (typeof value === "function") {
              // @ts-ignore - callable shape varies across HTMLElement methods vs NodeMods
              const v = value(element, index);
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
  }) as NodeMod<"div">;
};
