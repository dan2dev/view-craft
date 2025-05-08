declare type IHTMLElement<TTagName extends TagName = TagName> = {
  isSSR?: boolean;
  children: IHTMLElement[];
  appendChild: <TChildrenTagName extends TagName = TagName>(
    node: IHTMLElement<TChildrenTagName> | HTMLElement | Text | Comment,
  ) => void;
  toString: () => string;
  setAttribute: (attributeName: keyof HTMLElementTagNameMap[TTagName], value: typeof HTMLElementTagNameMap[TTagName]) => void;
};
