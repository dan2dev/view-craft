import type { Primitive as TypeFestPrimitive } from "type-fest/source/primitive";

declare global {
  export type Primitive = TypeFestPrimitive;
  export type ElementTagName = keyof HTMLElementTagNameMap;
  export type ElementAttributes<TTagName extends ElementTagName = ElementTagName> = {
    [K in keyof HTMLElementTagNameMap[TTagName]]?:
    | HTMLElementTagNameMap[TTagName][K]
    | (() => HTMLElementTagNameMap[TTagName][K]);
  };
  export type ExpandedElement<TTagName extends ElementTagName = ElementTagName> =
    & Partial<Omit<HTMLElementTagNameMap[TTagName], 'tagName'>>
    & Pick<HTMLElementTagNameMap[TTagName], 'tagName'>
    & {
      rawMods?: NodeMod<TTagName>[];
      mods?: (Primitive | ExpandedElement)[];
    }

  export type NodeModFn<TTagName extends ElementTagName = ElementTagName> =
    (parent: ExpandedElement<TTagName>, index: number) => NodeMod<TTagName>;

  export type NodeMod<TTagName extends ElementTagName = ElementTagName> =
    | ExpandedElement<TTagName>
    | Primitive
    | ElementAttributes<TTagName>
    | NodeModFn<TTagName>;

  export type NodeBuilder<TTagName extends ElementTagName = ElementTagName> =
    (...mods: NodeMod<TTagName>[]) =>
      (parent: ExpandedElement<TTagName>, index: number) => ExpandedElement<TTagName>;



  // tags from tags.ts
  const div: NodeBuilder<"div">;
}

export { };
