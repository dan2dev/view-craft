

// export const createVElement = <TTagName extends keyof HTMLElementTagNameMap>(
//   tagName: TTagName,
// ): VirtualElement<TTagName> => {
//   return {
//     tagName,
//     attributes: {},
//     children: [],
//     mods: [],
//     el: document ? document.createElement(tagName) : undefined,
//   };
// }

export const div: NodeBuilder<"div"> = (...mods: NodeMod<"div">[]) => {
  return ((parent: ExpandedElement<"div">, index: number) => {
    const element = document.createElement("div") as ExpandedElement<"div">;
    parent.rawMods = parent.mods || [];
    parent.mods = parent.rawMods.map((mod, modIndex) => {
      if (typeof mod === "function") {
        return mod(element, modIndex);
      }
      return mod;
    });
    parent.mods.forEach((mod) => {
      
    })


    return element;
  }) as NodeMod<"div">;
};
