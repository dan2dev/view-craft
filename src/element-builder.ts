import { processModifier } from "./modifiers";

/**
 * Creates an element builder function that returns a modifier function
 */
export function buildElement<TTagName extends ElementTagName>(
  tagName: TTagName,
  ...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]
): NodeModFn<TTagName> {
  return ((parent: ExpandedElement<TTagName>, index: number) => {
    const element = document.createElement(tagName) as ExpandedElement<TTagName>;
    let elementIndex = index;

    for (let iMod = 0; iMod < rawMods.length; iMod++) {
      let mod = rawMods[iMod];
      const compiledMod = processModifier(element, mod, elementIndex);
      if (compiledMod) {
        element.appendChild?.(compiledMod);
        elementIndex++;
      }
    }

    return element;
  }) as NodeModFn<TTagName>;
}

/**
 * Creates a tag builder function that accepts modifiers and returns an element builder
 */
export function createElementBuilder<TTagName extends ElementTagName>(
  tagName: TTagName,
): (...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]) => NodeModFn<TTagName> {
  return (...rawMods) => buildElement(tagName, ...rawMods);
}