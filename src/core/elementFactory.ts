import { createConditionalElement, processConditionalModifiers } from "./conditionalRenderer";
import { applyModifiers, NodeModifier } from "../internal/applyModifiers";
import { createElement, setHydrationParent } from "../utility/nodeFactory";
import { isHydrating } from "../utility/runtimeContext";

/**
 * Creates an element factory that applies the given modifiers to a freshly created node.
 * Now uses shared applyModifiers helper for consistency and reduced duplication.
 */
export function createElementFactory<TTagName extends ElementTagName>(
  tagName: TTagName,
  ...modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>
): NodeModFn<TTagName> {
  return (parent: ExpandedElement<TTagName>, index: number): ExpandedElement<TTagName> => {
    const { condition, otherModifiers } = processConditionalModifiers(modifiers);

    if (condition) {
      return createConditionalElement(tagName, condition, otherModifiers, parent as Node) as ExpandedElement<TTagName>;
    }

    // Set hydration context if needed
    if (isHydrating()) {
      setHydrationParent(parent as Node);
    }

    const el = createElement(tagName, parent as Node) as ExpandedElement<TTagName>;
    applyModifiers(
      el,
      otherModifiers as ReadonlyArray<NodeModifier<TTagName>>,
      index
    );
    return el;
  };
}

/**
 * Creates a tag builder function for the given HTML tag.
 */
export function createTagBuilder<TTagName extends ElementTagName>(
  tagName: TTagName,
): (...modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>) => NodeModFn<TTagName> {
  return (...mods) => createElementFactory(tagName, ...mods);
}