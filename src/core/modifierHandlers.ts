import { isPrimitive } from "../utility/isPrimitive";
import {
  isNode,
  isNotNullObject,
  isTag,
  isBoolean,
  isFunction,
} from "../utility";
import { createTagAttributes } from "./attributeHelpers";

// this holds the information of the index of the child nodes.
// it is used to keep track of the order of the child nodes.
// It is used to replace the child nodes in the DOM.
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

// export function text(value: string | (() => string)): Text {
//   const isFunction = typeof value === "function";
//   const compiled = isFunction ? value() : value;
//   const textNode = document.createTextNode(compiled);
//   // if (isFunction) {
//   //   updateWeakDomMap.set(textNode, () => (textNode.textContent = value()));
//   // }
//   return textNode;
// }

// export function handleModAppend<TTagName extends ElementTagName>(parent: Node, derived: Primitive | Node, update: () => void) {
//   if (isNode(derived)) {
//     parent.appendChild?.(derived);
//   } else if (isPrimitive(derived)) {
//     parent.appendChild?.(document.createTextNode(String(derived)));
//   }
// }

export function handleMod<TTagName extends ElementTagName>(
  parent: ExpandedElement<TTagName>,
  mod: NodeMod<TTagName> | NodeModFn<TTagName>,
  iMod: number,
): Node | void {
  if (mod == null) return;
  const isFunc = Boolean(isFunction(mod));
  const compiledMod = isFunc ? (mod as NodeModFn<TTagName>)(parent, iMod) : mod as NodeMod<TTagName>;

  if(compiledMod == null) return;
  if (isPrimitive(compiledMod)) {
    return document.createTextNode(String(compiledMod));
  } else if (isNode(compiledMod)) {
    return compiledMod;
  } else if (isNotNullObject(compiledMod)) {
    createTagAttributes(
      parent,
      compiledMod as ExpandedElementAttributes<TTagName>,
    );
  }
}
