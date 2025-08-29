// Type definitions for view-craft
// Project: view-craft
// Definitions by: Your Name <your.email@example.com>

// import { Merge } from "type-fest";
import { Merge, Or } from "type-fest";

// Export your main types here. Example:

// Element, SelfClosingElement, Text, Comment
declare global {
  export type ElementTagName = keyof HTMLElementTagNameMap;
  export type ElementAttributes<TTagName extends ElementTagName = ElementTagName> = {
    [K in keyof HTMLElementTagNameMap[TTagName]]?: HTMLElementTagNameMap[TTagName][K] | (() => HTMLElementTagNameMap[TTagName][K]);
  }


  // export type VirtualElementBase<TTagName extends ElementTagName = ElementTagName> = {
  //   virtual?: {
  //     tagName: TTagName;
  //     attributes?: ElementAttributes<TTagName>;
  //     nodes?: VirtualElement[];
  //   };
  // };
  export type VirtualElementNode<TTagName extends ElementTagName = ElementTagName> = {
    virtual: true;
    tagName: string | TTagName;
    attributes: ElementAttributes<TTagName>;
    coisa: string;
  }
  export type VirtualElement<TTagName extends ElementTagName = ElementTagName> =
    (HTMLElementTagNameMap[TTagName] & Partial<VirtualElementNode<TTagName>>) |
    (VirtualElementNode<TTagName> & {
      virtual: true;
    });

  // Merge<{
  //   virtual: true,
  //   tagName: TTagName;
  //   attributes: ElementAttributes<TTagName>;
  //   children: VirtualElement[];
  // }, Partial<HTMLElementTagNameMap[TTagName]>>;


  // export type VirtualElement<TTagName extends ElementTagName = ElementTagName> = {
  //   // tagName: TTagName | string; // tag name
  //   // att?: Partial<HTMLElementTagNameMap[TTagName]>;
  //   // children?: VirtualElement[];
  // } & OmitDeep<Partial<HTMLElementTagNameMap[TTagName]>, "children">;
  /**
   * A function that builds a virtual element tag.
   */
  export type NodeMod<TParentTag extends ElementTagName = ElementTagName> = (parent: VirtualElement<TParentTag>, index: number) => VirtualElement;
  export type NodeBuilder = (...children: NodeMod[]) => NodeMod;
}

// Add more types as needed for your API
export { };
