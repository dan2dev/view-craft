import { isPrimitive } from "../utility/isPrimitive";
import { isNode, isNotNullObject, isTag, isBoolean, isFunction } from "../utility";
import { createTagAttributes } from "./attributeHelpers";

// this holds the information of the index of the child nodes.
// it is used to keep track of the order of the child nodes.
// It is used to replace the child nodes in the DOM.
export const childrenVirtualMap = new WeakMap<
  ExpandedElement<any>,
  {
    [childrenIndex: number]: Node | null;
  }
>();

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
  element: ExpandedElement<TTagName>,
  mod: NodeMod<TTagName> | NodeModFn<TTagName>,
  iMod: number,
): void {
  if (mod == null) return;
  if (isFunction(mod)) {
    const compiledMod = (mod as NodeModFn<TTagName>)(element, iMod);
    // check exsting item
    const siblingsMap = childrenVirtualMap.get(element);
    if (siblingsMap) {
      const newSiblingsMap = { ...siblingsMap };
      childrenVirtualMap.set(element, {
        ...(childrenVirtualMap.get(element) || {}),
        // [iMod]: compiledMod,
      });
    }

    // if (childrenVirtualMap.get(compiledMod)) if (compiledMod == null) return;
  } else {
    // this is working as expected
    if (isPrimitive(mod)) {
      element.appendChild?.(document.createTextNode(String(mod)));
    } else if (isNode(mod)) {
      element.appendChild?.(mod);
    } else if (isNotNullObject(mod)) {
      createTagAttributes(element, mod as ExpandedElementAttributes<TTagName>);
    }
  }
}
