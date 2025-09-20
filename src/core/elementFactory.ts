import { handleMod } from "./modifierHandlers";

export function createTagReturn<TTagName extends ElementTagName>(
  tagName: TTagName,
  ...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]
): NodeModFn<TTagName> {
  return ((parent: ExpandedElement<TTagName>, index: number) => {
    const element = document.createElement(tagName) as ExpandedElement<TTagName>;
    for (let iMod = 0; iMod < rawMods.length; iMod++) {
      let mod = rawMods[iMod];
      handleMod(element, mod, iMod);
    }
    return element;
  }) as NodeModFn<TTagName>;
}

export function createTag<TTagName extends ElementTagName>(
  tagName: TTagName
): (...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]) => NodeModFn<TTagName> {
  return (...rawMods) => createTagReturn(tagName, ...rawMods);
}
