declare type ElementTagName = keyof HTMLElementTagNameMap;
declare type SVGTagName = keyof SVGElementTagNameMap;
declare type MathMLTagName = keyof MathMLElementTagNameMap;

// declare type TagName = ElementTagName | SVGTagName | MathMLTagName;



declare type ModifierFn<TTagName extends TagName = TagName> =
  | ((
      element: IHTMLElement<TTagName>,
      index: number,
      parent: IHTMLElement<TagName>,
    ) => void)
  | string
  | number
  | boolean;

declare global {
  declare interface Window {
    [tag: TagName]: (
      ...modifiers: ModifierFn<TagName>[]
    ) => () => HTMLDivElement;
    // Extend Window interface with additional properties here
    // Example: customProperty: string;
  }

  interface GlobalThis {
    // Extend GlobalThis interface with additional properties here
    // Example: customGlobalFunction: () => void;
  }
}

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
declare global {
  interface Window {
    [K in TagName]: (
      ...modifiers: ModifierFn<K>[]
    ) => (parent: ChildLinkType<TAnchor>) => HTMLElementTagNameMap[K];
  }
}
// declare function h2(...modifiers: ModifierFn<"h2">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"h2">;
// declare function span(...modifiers: ModifierFn<"span">[]): (parent: any, index: number) => HTMLSpanElement | IHTMLElement<"span">;
