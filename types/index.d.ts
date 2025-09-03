import type { Primitive } from "type-fest/source/primitive";

declare global {
  export type ElementTagName = keyof HTMLElementTagNameMap;
  export type ElementAttributes<TTagName extends ElementTagName = ElementTagName> = {
    [K in keyof HTMLElementTagNameMap[TTagName]]?: HTMLElementTagNameMap[TTagName][K] | (() => HTMLElementTagNameMap[TTagName][K]);
  }
  export type VirtualElement<TTagName extends ElementTagName = ElementTagName> = {
    tagName: TTagName;
    attributes: ElementAttributes<TTagName>;
    children: (VirtualElement | Primitive)[];
    parent?: WeakRef<VirtualElement>;
    el?: HTMLElementTagNameMap[TTagName];
  }

  export type NodeMod<TParentTag extends ElementTagName = ElementTagName> =
    (parent: VirtualElement<TParentTag>, index: number) =>
      VirtualElement | Primitive
  export type NodeBuilder = (...children: NodeMod[]) => NodeMod;
}

// Add more types as neeed for your API
export { };
