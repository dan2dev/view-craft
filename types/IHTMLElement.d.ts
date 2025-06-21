/* eslint-disable @typescript-eslint/no-unused-vars */





// declare function div(...modifiers: ModifierFn<"div">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"div">;
// declare const div = (...modifiers: Modifier<"div">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"div">;
declare const span = (...modifiers: Modifier<"span">[]) => <TParent>(parent?: TParent, index?: number) => IHTMLElement<"span">;
declare const p = (...modifiers: Modifier<"p">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"p">;
declare const a = (...modifiers: Modifier<"a">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"a">;
declare const h1 = (...modifiers: Modifier<"h1">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"h1">;
declare const h2 = (...modifiers: Modifier<"h2">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"h2">;
// declare function h1(...modifiers: ModifierFn<"h1">[]): <TParent>(parent: TParent, index: number) => IHTMLElement<"h1">;
// declare function h2(...modifiers: ModifierFn<"h2">[]): <TParent>(parent: TParent, index: number) => IHTMLElement<"h2">;


declare type VirtualElement<DomElement extends Node = Node, TProps extends {} = {}> = Partial<DomElement> & TProps;


// TAGS----------------------
// div
declare type VirtualDivElement = VirtualElement<HTMLDivElement, { tagName: "div" }>;
declare type VirtualDivModType = void | string | number | boolean | null | undefined | VirtualElement | {
  className: string;
}
declare const div = (...modifiers:
  (
    | ((element: VirtualDivElement, index: number) => VirtualDivModType)
    | VirtualDivModType
  )[]
) => ((parent: VirtualElement, index: number) => VirtualDivElement);
// -----
// input
declare type VirtualInputElement = VirtualElement<HTMLInputElement, { tagName: "input" }>;
declare type VirtualInputModType = void | string | number | boolean | null | undefined | VirtualElement | Partial<{
  className: string;
  type: string;
  value: string;
  id: string;
  placeholder: string;
}>
declare const input = (...modifiers:
  (
    | ((element: VirtualInputElement, index: number) => VirtualInputModType)
    | VirtualInputModType
  )[]
) => ((parent: VirtualElement, index: number) => VirtualInputElement);
// -----
// label
declare type VirtualLabelElement = VirtualElement<HTMLLabelElement, { tagName: "label" }>;
declare type VirtualLabelModType = void | string | number | boolean | null | VirtualElement | {
  className?: string;
  for?: string;
}
declare const label = (...modifiers:
  (
    | ((element: VirtualLabelElement, index: number) => VirtualLabelModType)
    | VirtualLabelModType
  )[]
) => ((parent: VirtualElement, index: number) => VirtualLabelElement);
