import { findConditionalModifier } from "./modifierProcessor";
import { isBrowser } from "../utility/environment";
import { storeConditionalInfo } from "../utility/conditionalInfo";
import type { ConditionalInfo } from "../utility/conditionalInfo";
import { applyModifiers, NodeModifier } from "../internal/applyModifiers";
import { createElement, createComment, setHydrationParent } from "../utility/nodeFactory";
import { isSSR, isHydrating } from "../utility/runtimeContext";
import { claimChild } from "./hydration";

/**
 * Creates a conditional element or comment based on the condition result (SSR + browser unified)
 */
export function createConditionalElement<TTagName extends ElementTagName>(
  tagName: TTagName,
  condition: () => boolean,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>,
  parent?: Node
): ExpandedElement<TTagName> | Comment {
  const passed = condition();

  if (!isBrowser) {
    return passed
      ? createElementWithModifiers(tagName, modifiers)
      : createComment(`conditional-${tagName}-ssr`) as unknown as ExpandedElement<TTagName>;
  }

  if (isHydrating() && parent) {
    // Hydration mode: try to claim existing element or comment
    if (passed) {
      // Expecting an element
      const existing = claimChild(parent, "element", tagName);
      if (existing) {
        storeConditionalInfo(existing, { condition, tagName, modifiers } as ConditionalInfo);
        return existing as ExpandedElement<TTagName>;
      }
      // Fallback: create new element
      const el = createElementWithModifiers(tagName, modifiers);
      storeConditionalInfo(el as Node, { condition, tagName, modifiers } as ConditionalInfo);
      return el;
    } else {
      // Expecting a comment
      const existing = claimChild(parent, "comment");
      if (existing && existing.nodeType === Node.COMMENT_NODE) {
        storeConditionalInfo(existing, { condition, tagName, modifiers } as ConditionalInfo);
        return existing as unknown as ExpandedElement<TTagName>;
      }
      // Fallback: create new comment
      const comment = createComment(`conditional-${tagName}-hidden`);
      storeConditionalInfo(comment as Node, { condition, tagName, modifiers } as ConditionalInfo);
      return comment as unknown as ExpandedElement<TTagName>;
    }
  }

  // Browser mode: create based on condition
  if (passed) {
    const el = createElementWithModifiers(tagName, modifiers);
    storeConditionalInfo(el as Node, { condition, tagName, modifiers } as ConditionalInfo);
    return el;
  }

  const comment = createComment(`conditional-${tagName}-hidden`);
  storeConditionalInfo(comment as Node, { condition, tagName, modifiers } as ConditionalInfo);
  return comment as unknown as ExpandedElement<TTagName>;
}

/**
 * Creates an element and applies all modifiers to it (shared helper based).
 */
function createElementWithModifiers<TTagName extends ElementTagName>(
  tagName: TTagName,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): ExpandedElement<TTagName> {
  const el = createElement(tagName) as ExpandedElement<TTagName>;
  applyModifiers(
    el,
    modifiers as ReadonlyArray<NodeModifier<TTagName>>,
    0
  );
  return el;
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
