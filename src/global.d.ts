declare type IHTMLElement<TTagName extends TagName = TagName> = {
  isSSR?: boolean;
  children: IHTMLElement[];
  appendChild: <TChildrenTagName extends TagName = TagName>(
    node: IHTMLElement<TChildrenTagName> | HTMLElement | Text | Comment,
  ) => void;
  toString: () => string;
  setAttribute: (
    attributeName: keyof HTMLElementTagNameMap[TTagName],
    value: (typeof HTMLElementTagNameMap)[TTagName],
  ) => void;
};

declare type TagBasic<
  TTagName extends TagName = TagName,
  TParent extends IHTMLElement<TagName> = Partial<IHTMLElement<TagName>>,
> = (parent: TParent, index: number) => Partial<IHTMLElement<TTagName>>;

declare type IHTMLElementProps = {
  div: {
    className: string;
    children: any[];
  };
};


// declare type IHTMLElementProps
declare function div(...modifiers: ModifierFn<"div">[]): (parent: any, index: number) => HTMLDivElement | IHTMLElement<"div">;
declare function h1(...modifiers: ModifierFn<"h1">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"h1">;
declare function h2(...modifiers: ModifierFn<"h2">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"h2">;
declare function span(...modifiers: ModifierFn<"span">[]): (parent: any, index: number) => HTMLSpanElement | IHTMLElement<"span">;
