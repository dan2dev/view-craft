import { applyNodeModifier } from "./modifierProcessor";

/**
 * Creates an element factory that applies the given modifiers to a freshly created node.
 */
export function createElementFactory<TTagName extends ElementTagName>(
  tagName: TTagName,
  ...modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): NodeModFn<TTagName> {
  return (parent: ExpandedElement<TTagName>, index: number) => {
    const element = document.createElement(tagName) as ExpandedElement<TTagName>;
    let localIndex = index;

    modifiers.forEach((modifier) => {
      const renderedNode = applyNodeModifier(element, modifier, localIndex);
      if (renderedNode) {
        const node = renderedNode as Node;
        const parentNode = element as unknown as Node & ParentNode;
        if (node.parentNode !== parentNode) {
          parentNode.appendChild(node);
        }
        localIndex += 1;
      }
    });

    return element;
  };
}

/**
 * Creates a tag builder function for the given HTML tag.
 */
export function createTagBuilder<TTagName extends ElementTagName>(
  tagName: TTagName,
): (...modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>) => NodeModFn<TTagName> {
  return (...modifiers) => createElementFactory(tagName, ...modifiers);
}
