import { applyNodeModifier, findConditionalModifier } from "./modifierProcessor";
import { isBrowser } from "../utility/environment";

/**
 * Creates an element factory that applies the given modifiers to a freshly created node.
 */
export function createElementFactory<TTagName extends ElementTagName>(
  tagName: TTagName,
  ...modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): NodeModFn<TTagName> {
  return (parent: ExpandedElement<TTagName>, index: number) => {
    // Check if any modifier is a conditional boolean function
    const conditionalIndex = findConditionalModifier(modifiers);
    if (conditionalIndex !== -1) {
      const condition = modifiers[conditionalIndex] as () => boolean;
      const otherModifiers = modifiers.filter((_, index) => index !== conditionalIndex);
      
      if (!isBrowser) {
        // For SSR, create element if condition is true, otherwise return comment
        if (condition()) {
          const element = document.createElement(tagName) as ExpandedElement<TTagName>;
          let localIndex = 0;
          otherModifiers.forEach((modifier) => {
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
        } else {
          return document.createComment(`conditional-${tagName}-ssr`) as unknown as ExpandedElement<TTagName>;
        }
      }

      // Browser implementation: create element or comment based on current condition
      if (condition()) {
        const element = document.createElement(tagName) as ExpandedElement<TTagName>;
        let localIndex = 0;

        otherModifiers.forEach((modifier) => {
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

        // Store conditional info on element for updates
        (element as any)._conditionalInfo = { condition, tagName, modifiers: otherModifiers };
        
        return element;
      } else {
        // Create comment placeholder
        const comment = document.createComment(`conditional-${tagName}-hidden`);
        (comment as any)._conditionalInfo = { condition, tagName, modifiers: otherModifiers };
        return comment as unknown as ExpandedElement<TTagName>;
      }
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
