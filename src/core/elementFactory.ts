import { applyNodeModifier, isConditionalModifier } from "./modifierProcessor";
import { createConditionalElement } from "./conditionalElement";

/**
 * Creates an element factory that applies the given modifiers to a freshly created node.
 */
export function createElementFactory<TTagName extends ElementTagName>(
  tagName: TTagName,
  ...modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): NodeModFn<TTagName> {
  return (parent: ExpandedElement<TTagName>, index: number) => {
    // Check if first modifier is a conditional boolean function based on context
    if (modifiers.length > 1 && isConditionalModifier(modifiers[0], modifiers.slice(1))) {
      const condition = modifiers[0] as () => boolean;
      const remainingModifiers = modifiers.slice(1);
      
      return createConditionalElement(
        tagName,
        condition,
        remainingModifiers,
        parent,
        index
      ) as unknown as ExpandedElement<TTagName>;
    }

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
