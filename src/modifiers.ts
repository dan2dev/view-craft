import { isPrimitive, isNode, isNotNullObject, isFunction } from "./utils";
import { applyAttributes } from "./attributes";

// These WeakMaps hold information about the index of child nodes
// Used to keep track of the order of child nodes and replace them in the DOM
export const childrenVirtualPrimitiveMap = new WeakMap<
  ExpandedElement<any>,
  Map<number, Primitive>
>();
export const childrenVirtualDomMap = new WeakMap<
  ExpandedElement<any>,
  Map<number, Node>
>();
export const childrenVirtualDomUpdateMap = new WeakMap<
  ExpandedElement<any>,
  Map<number, () => void>
>();
export const nodeElements = new Set<ExpandedElement<any>>();

/**
 * Processes a single modifier and applies it to the parent element
 */
export function processModifier<TTagName extends ElementTagName>(
  parent: ExpandedElement<TTagName>,
  mod: NodeMod<TTagName> | NodeModFn<TTagName>,
  index: number,
): Node | void {
  if (mod == null) return;

  const isFunc = Boolean(isFunction(mod));
  const compiledMod = isFunc ? (mod as NodeModFn<TTagName>)(parent, index) : mod as NodeMod<TTagName>;

  if (compiledMod == null) return;

  if (isPrimitive(compiledMod)) {
    return document.createTextNode(String(compiledMod));
  } else if (isNode(compiledMod)) {
    return compiledMod;
  } else if (isNotNullObject(compiledMod)) {
    applyAttributes(
      parent,
      compiledMod as ExpandedElementAttributes<TTagName>,
    );
  }
}