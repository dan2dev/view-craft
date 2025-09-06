import type { Primitive } from "type-fest/source/primitive";

declare global {
  export type ElementTagName = keyof HTMLElementTagNameMap;
  export type ElementAttributes<TTagName extends ElementTagName = ElementTagName> = {
    [K in keyof HTMLElementTagNameMap[TTagName]]?:
    | HTMLElementTagNameMap[TTagName][K]
    | (() => HTMLElementTagNameMap[TTagName][K]);
  };
  // export type VirtualElement<TTagName extends ElementTagName = ElementTagName> = {
  //   tagName: TTagName;
  //   attributes: ElementAttributes<TTagName>;
  //   children: (VirtualElement | Primitive)[];
  //   mods: (NodeMod<TTagName>)[];
  //   el?: HTMLElementTagNameMap[TTagName];
  // };
  // export type VirtualElement<TTagName extends ElementTagName = ElementTagName> = Partial<ElementAttributes<TTagName>>;
  export type ExpandedElement<TTagName extends ElementTagName = ElementTagName> =
    & Partial<Omit<HTMLElementTagNameMap[TTagName], 'tagName'>>
    & Pick<HTMLElementTagNameMap[TTagName], 'tagName'>
    & {
      rawMods?: NodeMod<TTagName>[];
      mods?: (Primitive | ExpandedElement)[];
    }

  export type NodeMod<TTagName extends ElementTagName = ElementTagName> =
    // | VirtualElement
    | ExpandedElement<TTagName>
    | Primitive
    | (
      (element: ExpandedElement<TTagName>, index: number) =>
        | ExpandedElement
        | Primitive
    );
  export type NodeBuilder<TTagName extends ElementTagName = ElementTagName> =
    (...mods: NodeMod<TTagName>[]) => NodeMod<TTagName>;
}

// Add more types as neeed for your API
export { };
