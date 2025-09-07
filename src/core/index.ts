


export const div: NodeBuilder<"div"> = (...mods: NodeMod<"div">[]) => {
  return ((parent: ExpandedElement<"div">, index: number) => {
    const element = document.createElement("div") as ExpandedElement<"div">;
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
          Object.entries(mod as ExpandedElement).forEach(([key, value]) => {
            if (key === "rawMods" || key === "mods") {
              return;
            }
            if (typeof value === "function") {
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
        const text = document.createTextNode(String(mod));
        element.appendChild?.(text);
      } else {
        const text = document.createTextNode(mod as string);
        element.appendChild?.(text);
      }
    });
    return element;
  }) as NodeMod<"div">;
};
