/* eslint-disable @typescript-eslint/no-unused-vars */
// declare function div(...modifiers: ModifierFn<"div">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"div">;
declare const div = (...modifiers: Modifier<"div">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"div">;
declare const span = (...modifiers: Modifier<"span">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"span">;
declare const p = (...modifiers: Modifier<"p">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"p">;
declare const a = (...modifiers: Modifier<"a">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"a">;
declare const h1 = (...modifiers: Modifier<"h1">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"h1">;
declare const h2 = (...modifiers: Modifier<"h2">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"h2">;
// declare function h1(...modifiers: ModifierFn<"h1">[]): <TParent>(parent: TParent, index: number) => IHTMLElement<"h1">;
// declare function h2(...modifiers: ModifierFn<"h2">[]): <TParent>(parent: TParent, index: number) => IHTMLElement<"h2">;


declare type InputElement = Partial<HTMLInputElement> & {};
declare type InputMods = (element: InputElement) => void | object | boolean;
declare const input = (...modifiers: InputMods[]) => <TParent extends HTMLElement>(parent: TParent, index: number) => InputElement;
