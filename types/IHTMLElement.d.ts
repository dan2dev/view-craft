// declare function div(...modifiers: ModifierFn<"div">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"div">;
declare const div = (...modifiers: ModifierFn<"div">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"div">;
declare const span = (...modifiers: ModifierFn<"span">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"span">;
declare const p = (...modifiers: ModifierFn<"p">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"p">;
declare const a = (...modifiers: ModifierFn<"a">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"a">;
declare const h1 = (...modifiers: ModifierFn<"h1">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"h1">;
declare const h2 = (...modifiers: ModifierFn<"h2">[]) => <TParent>(parent: TParent, index: number) => IHTMLElement<"h2">;
// declare function h1(...modifiers: ModifierFn<"h1">[]): <TParent>(parent: TParent, index: number) => IHTMLElement<"h1">;
// declare function h2(...modifiers: ModifierFn<"h2">[]): <TParent>(parent: TParent, index: number) => IHTMLElement<"h2">;
