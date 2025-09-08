import type { Primitive as TypeFestPrimitive } from "type-fest/source/primitive";

declare global {
  export type Primitive = TypeFestPrimitive;
  export type ElementTagName = keyof HTMLElementTagNameMap;

  // Expanded element types (with mods)
  export type ExpandedElementAttributes<TTagName extends ElementTagName = ElementTagName> = {
    [K in keyof HTMLElementTagNameMap[TTagName]]?:
    | HTMLElementTagNameMap[TTagName][K]
    | (() => HTMLElementTagNameMap[TTagName][K]);
  };
  export type ExpandedElement<TTagName extends ElementTagName = ElementTagName> =
    & Partial<Omit<HTMLElementTagNameMap[TTagName], 'tagName'>>
    & Pick<HTMLElementTagNameMap[TTagName], 'tagName'>
    & {
      rawMods?: (NodeMod<TTagName> | NodeModFn<TTagName>)[];
      mods?: NodeMod<TTagName>[];
    }

  // Node modifier types
  export type NodeMod<TTagName extends ElementTagName = ElementTagName> =
    | Primitive
    | ExpandedElementAttributes<TTagName>
    | ExpandedElement<TTagName>;
  export type NodeModFn<TTagName extends ElementTagName = ElementTagName> =
    (parent: ExpandedElement<TTagName>, index: number) => NodeMod<TTagName>;


  // Node tags builder type
  export type ExpandedElementBuilder<TTagName extends ElementTagName = ElementTagName> =
    (...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]) =>
      (parent?: ExpandedElement<TTagName>, index?: number) => ExpandedElement<TTagName>;

  // tags from tags.ts
  export const div: ExpandedElementBuilder<"div">;
  export const span: ExpandedElementBuilder<"span">;
}

export { };
