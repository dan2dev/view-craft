import { handleMod } from "./modifierHandlers";

export const createTagReturn = <TTagName extends keyof HTMLElementTagNameMap>(tagName: TTagName, ...rawMods: any[]) => {
  return ((parent: any, index: number) => {
    const element: any = document.createElement(tagName);
    for (let iMod = 0; iMod < rawMods.length; iMod++) {
      let mod = rawMods[iMod];
      handleMod(element, mod, iMod);
    }
    return element;
  }) as any;
};

export const createTag =
  <TTagName extends keyof HTMLElementTagNameMap>(tagName: TTagName) =>
  (...rawMods: any[]): any =>
    createTagReturn(tagName, ...rawMods);
