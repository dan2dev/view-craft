import { isBrowser, isNode } from "./isBrowser";

export type TVHtmlElement<TTagName extends keyof HTMLElementTagNameMap> = {
  render?: () => string;
  toString: () => string;
} & Omit<Partial<HTMLElementTagNameMap[TTagName]>, "render" | "toString">;

export class VirtualHTMLElement<TTagName extends keyof HTMLElementTagNameMap> {
  public readonly tagName: string;
  constructor(tagName: TTagName) {
    this.tagName = tagName as string;
  }

  public render(): string {
    return `<${this.tagName}>`;
  }

  public toString(): string {
    return `<${this.tagName}>`;
  }
}

export type VTextNode = {
  textContent: string;
  render?: () => string;
  toString: () => string;
} & Omit<Partial<Text>, "textContent" | "render" | "toString">;

export const createElement = isBrowser
  ? <TTagName extends keyof HTMLElementTagNameMap>(
      tagName: TTagName,
    ): TVHtmlElement<TTagName> => {
      return document.createElement(tagName) as TVHtmlElement<TTagName>;
    }
  : <TTagName extends keyof HTMLElementTagNameMap>(
      tagName: TTagName,
    ): TVHtmlElement<TTagName> => {
      return new VirtualHTMLElement(tagName) as TVHtmlElement<TTagName>;
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
