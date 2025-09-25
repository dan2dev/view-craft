import { applyNodeModifier, findConditionalModifier } from "./modifierProcessor";
import { isBrowser } from "../utility/environment";

export interface ConditionalInfo {
  condition: () => boolean;
  tagName: string;
  modifiers: Array<NodeMod<any> | NodeModFn<any>>;
}

/**
 * Creates a conditional element or comment based on the condition result
 */
export function createConditionalElement<TTagName extends ElementTagName>(
  tagName: TTagName,
  condition: () => boolean,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): ExpandedElement<TTagName> | Comment {
  if (!isBrowser()) {
    return createSSRConditionalElement(tagName, condition, modifiers);
  }

  return createBrowserConditionalElement(tagName, condition, modifiers);
}

/**
 * Creates conditional element for SSR environment
 */
function createSSRConditionalElement<TTagName extends ElementTagName>(
  tagName: TTagName,
  condition: () => boolean,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): ExpandedElement<TTagName> | Comment {
  if (condition()) {
    return createElementWithModifiers(tagName, modifiers);
  } else {
    return document.createComment(`conditional-${tagName}-ssr`) as unknown as ExpandedElement<TTagName>;
  }
}

/**
 * Creates conditional element for browser environment
 */
function createBrowserConditionalElement<TTagName extends ElementTagName>(
  tagName: TTagName,
  condition: () => boolean,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): ExpandedElement<TTagName> | Comment {
  if (condition()) {
    const element = createElementWithModifiers(tagName, modifiers);
    attachConditionalInfo(element as Node, condition, tagName, modifiers);
    return element;
  } else {
    const comment = document.createComment(`conditional-${tagName}-hidden`);
    attachConditionalInfo(comment as Node, condition, tagName, modifiers);
    return comment as unknown as ExpandedElement<TTagName>;
  }
}

/**
 * Creates an element and applies all modifiers to it
 */
function createElementWithModifiers<TTagName extends ElementTagName>(
  tagName: TTagName,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): ExpandedElement<TTagName> {
  const element = document.createElement(tagName) as ExpandedElement<TTagName>;
  let localIndex = 0;

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
}

/**
 * Attaches conditional information to a node for later updates
 */
function attachConditionalInfo(
  node: Node,
  condition: () => boolean,
  tagName: string,
  modifiers: Array<NodeMod<any> | NodeModFn<any>>
): void {
  (node as any)._conditionalInfo = {
    condition,
    tagName,
    modifiers
  } as ConditionalInfo;
}

/**
 * Checks if a node has conditional information attached
 */
export function hasConditionalInfo(node: Node): boolean {
  return !!(node as any)._conditionalInfo;
}

/**
 * Gets conditional information from a node
 */
export function getConditionalInfo(node: Node): ConditionalInfo | null {
  return (node as any)._conditionalInfo || null;
}

/**
 * Processes conditional modifiers and separates them from regular modifiers
 */
export function processConditionalModifiers<TTagName extends ElementTagName>(
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): {
  condition: (() => boolean) | null;
  otherModifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>;
} {
  const conditionalIndex = findConditionalModifier(modifiers);
  
  if (conditionalIndex === -1) {
    return {
      condition: null,
      otherModifiers: modifiers
    };
  }

  const condition = modifiers[conditionalIndex] as () => boolean;
  const otherModifiers = modifiers.filter((_, index) => index !== conditionalIndex);

  return {
    condition,
    otherModifiers
  };
}