declare type TagName =
  | "div"
  | "p"
  | "a"
  | "em"
  | "strong"
  | "section"
  | "article"
  | "nav"
  | "header"
  | "footer"
  | "main"
  | "ul"
  | "ol"
  | "li"
  | "table"
  | "thead"
  | "tbody"
  | "tr"
  | "td"
  | "th"
  | "form"
  | "label"
  | "select"
  | "option"
  | "textarea"
  | "button"
  | "blockquote"
  | "pre"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span";

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

declare type ModifierResult<TTagName extends TagName = TagName> = ChildDomType | string | number | boolean | null | undefined | void;
declare type ModifierFn<TTagName extends TagName = TagName> = (parent: ChildDomType, index: number) => ModifierFn<TTagName> | ChildDomType | ChildDomType[] | string | number | boolean | null | undefined;
declare type Modifier<TTagName extends TagName = TagName> = ModifierFn<TTagName> | string | number | null | undefined | ChildDomType;



