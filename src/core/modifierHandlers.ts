import { isPrimitive } from "../utility/isPrimitive";
import { isNode, isNotNullObject, isTag, isBoolean, isFunction } from "../utility";
import { createTagAttributes } from "./attributeHelpers";

// this holds the information of the index of the child nodes.
// it is used to keep track of the order of the child nodes.
// It is used to replace the child nodes in the DOM.
export const childrenVirtualMap = new WeakMap<ExpandedElement<any>, Map<number, NodeMod<any>>>();
export const childrenVirtualUpdateMap = new WeakMap<ExpandedElement<any>, Map<number, () => void>>();

export function text(value: string | (() => string)): Text {
  const isFunction = typeof value === "function";
  const compiled = isFunction ? value() : value;
  const textNode = document.createTextNode(compiled);
  // if (isFunction) {
  //   updateWeakDomMap.set(textNode, () => (textNode.textContent = value()));
  // }
  return textNode;
}

export function handleModAppend<TTagName extends ElementTagName>(parent: Node, derived: Primitive | Node, update: () => void) {
  if (isNode(derived)) {
    parent.appendChild?.(derived);
  } else if (isPrimitive(derived)) {
    parent.appendChild?.(document.createTextNode(String(derived)));
  }
}

export function handleMod<TTagName extends ElementTagName>(
  parent: ExpandedElement<TTagName>,
  mod: NodeMod<TTagName> | NodeModFn<TTagName>,
  iMod: number,
): void {
  if (mod == null) return;
  if (isFunction(mod)) {
    const compiledMod = (mod as NodeModFn<TTagName>)(parent, iMod);
    if (!childrenVirtualMap.get(parent)) {
      childrenVirtualMap.set(parent, new Map());
    }
    if (isPrimitive(compiledMod)) {
      childrenVirtualMap.get(parent)!.set(iMod, compiledMod);
      const nodeText = document.createTextNode(String(compiledMod));
      childrenVirtualMap.get(parent)!.set(iMod, nodeText);
      childrenVirtualUpdateMap.get(parent)!.set(iMod, () => {
        nodeText.textContent = String(compiledMod);
      });
    }

    // se for diferente. Substituir
    // childrenVirtualMap.get(parent)?.set(iMod, compiledMod);

    // if (childrenVirtualMap.get(parent)) if (compiledMod == null) return;
  } else {
    if (isPrimitive(mod)) {
      parent.appendChild?.(document.createTextNode(String(mod)));
    } else if (isNode(mod)) {
      parent.appendChild?.(mod);
    } else if (isNotNullObject(mod)) {
      createTagAttributes(parent, mod as ExpandedElementAttributes<TTagName>);
    }
  }
}
