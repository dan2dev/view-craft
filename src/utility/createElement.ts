export type VHtmlElement<TTagName extends string> = {
  tagName: TTagName | string;
  render?: () => string;
  toString: () => string;
} & Omit<Partial<HTMLElement>, "tagName" | "render" | "toString">;

export const createElemenet = <TTagName extends string>(
  tagName: TTagName,
): VHtmlElement<TTagName> => {
  if (document && document.createElement) {
    return document.createElement(tagName, { is: tagName });
  }
};
