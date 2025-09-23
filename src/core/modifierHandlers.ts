import { isPrimitive } from "../utility/isPrimitive";
import { isNode, isNotNullObject, isTag, isBoolean, isFunction } from "../utility";
import { createTagAttributes } from "./attributeHelpers";

// this holds the information of the index of the child nodes.
// it is used to keep track of the order of the child nodes.
// It is used to replace the child nodes in the DOM.
export const childrenVirtualPrimitiveMap = new WeakMap<ExpandedElement<any>, Map<number, Primitive>>();
export const childrenVirtualDomMap = new WeakMap<ExpandedElement<any>, Map<number, Node>>();
export const childrenVirtualDomUpdateMap = new WeakMap<ExpandedElement<any>, Map<number, () => void>>();
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
  if (isFunction(mod)) {
    const compiledMod = (mod as NodeModFn<TTagName>)(parent, iMod);

    if (compiledMod instanceof Node) {
      return compiledMod;
    }
    // if (!childrenVirtualDomMap.get(parent)) {
    //   childrenVirtualDomMap.set(parent, new Map());
    //   childrenVirtualPrimitiveMap.set(parent, new Map());
    //   childrenVirtualDomUpdateMap.set(parent, new Map());
    // }
    // if (isPrimitive(compiledMod)) {
    //   childrenVirtualPrimitiveMap.get(parent)!.set(iMod, compiledMod);
    //   const nodeText = document.createTextNode(String(compiledMod));
    //   childrenVirtualDomMap.get(parent)!.set(iMod, nodeText);
    //   childrenVirtualDomUpdateMap.get(parent)!.set(iMod, () => {
    //     if (nodeText.textContent !== String(compiledMod)) {
    //       nodeText.textContent = String(compiledMod);
    //     }
    //   });
    // } else if (isNode(compiledMod)) {
    //   parent.appendChild?.(compiledMod);
    //   childrenVirtualDomUpdateMap.get(parent)!.set(iMod, () => {
    //     if (childrenVirtualDomMap.get(parent)!.get(iMod) !== compiledMod) {
    //       const newCompiledMod = (mod as NodeModFn<TTagName>)(parent, iMod);
    //       parent.replaceWith?.(compiledMod, newCompiledMod as Node);
    //     }
    //   });
    //   childrenVirtualDomUpdateMap.get(parent)?.get(iMod)?.();
    //   // if(childrenVirtualDomMap.get(parent)!.get(iMod) !== compiledMod) {
    //   //   childrenVirtualDomUpdateMap.get(parent)!.set(iMod, () => {
    //   //     if (nodeText.textContent !== String(compiledMod)) {
    //   //       nodeText.textContent = String(compiledMod);
    //   //     }
    //   //   });
    //   //   childrenVirtualPrimitiveMap.get(parent)!.get(iMod);
    //   // }
    // }

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
