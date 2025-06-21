export type VHtmlElement<TTagName extends keyof HTMLElementTagNameMap> = {
  tagName: TTagName;
  render?: () => string;
  toString: () => string;
} & Omit<
  Partial<HTMLElementTagNameMap[TTagName]>,
  "tagName" | "render" | "toString"
>;

export type VTextNode = {
  textContent: string;
  render?: () => string;
  toString: () => string;
} & Omit<Partial<Text>, "textContent" | "render" | "toString">;

export const createElement = <TTagName extends string>(
  tagName: TTagName,
): VHtmlElement<TTagName, HTMLElement> => {
  if (document && document.createElement) {
    return document.createElement(tagName, { is: tagName });
  }
};

export const createTextNode = (text: string): VTextNode => {
  if (document && document.createTextNode) {
    return document.createTextNode(text);
  }
};

export const createComment = (text: string): VHtmlElement<"#comment"> => {
  if (document && document.createComment) {
    return document.createComment(text);
  }
};

export const createFragment = (): VHtmlElement<"#fragment"> => {
  if (document && document.createDocumentFragment) {
    return document.createDocumentFragment();
  }
};
