import { handleMod } from "./modifierHandlers";

export const createTagReturn = <TTagName extends keyof HTMLElementTagNameMap>(
  tagName: TTagName,
  ...rawMods: unknown[]
) => {
  return ((parent: Partial<HTMLElementTagNameMap[TTagName]> & { [key: string]: unknown }, index: number) => {
    const element = document.createElement(tagName) as Partial<HTMLElementTagNameMap[TTagName]> & { [key: string]: unknown };
    for (let iMod = 0; iMod < rawMods.length; iMod++) {
      let mod = rawMods[iMod];
      handleMod(element, mod, iMod);
    }
    return element;
  }) as unknown;
};

export const createTag =
  <TTagName extends keyof HTMLElementTagNameMap>(tagName: TTagName) =>
  (...rawMods: unknown[]): unknown =>
    createTagReturn(tagName, ...rawMods);
