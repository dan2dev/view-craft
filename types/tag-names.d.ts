declare type TagName = keyof HTMLElementTagNameMap;

declare type HtmlElementTagMap = {
  [K in TagName]: K extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[K]
    : never;
};

declare type HeadTagName =
  | "title"
  | "base"
  | "link"
  | "meta"
  | "style"
  | "script"
  | "noscript";

declare type SelfClosingTagName =
  | "area"
  | "base"
  | "br"
  | "col"
  | "embed"
  | "hr"
  | "img"
  | "input"
  | "keygen"
  | "link"
  | "meta"
  | "param"
  | "source"
  | "track"
  | "wbr";

declare type ChildDomType =
  | DuoHtmlElement
  | HTMLElement
  | SVGElement
  | MathMLElement
  | Text
  | Comment;

declare type ChildLinkType<T> =
  | {
      parent: T;
      index: number;
    }
  | {
      anchor: T;
      index: number;
    };

type TagProps = {
  div: Partial<HTMLDivElement>;
};

type DuoNode<TNode extends Partial<Node> = Partial<Node>> = Partial<TNode> & {
  tagName: string;
  render?(): string;
  appendChild(child: DuoNode): void;
};

declare type ModifierResult<TTagName extends TagName = TagName> =
  | ChildDomType
  | string
  | number
  | boolean
  | null
  | undefined
  | void;
declare type ModifierFn<
  TNode extends Partial<Node> = Partial<Node>,
  TTagName extends TagName = TagName,
> = (
  parent: ChildDomType,
  index: number,
) =>
  | ModifierFn<TTagName>
  | ChildDomType
  | ChildDomType[]
  | string
  | number
  | boolean
  | null
  | undefined;
declare type Modifier<
  TNode extends Partial<Node> = Partial<Node>,
  TTagName extends TagName = TagName,
> = ModifierFn<TTagName> | string | number | null | undefined | ChildDomType;
