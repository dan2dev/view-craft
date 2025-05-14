declare type TagName =  "div" | "h1" | "span";
declare type SelfClosingTagName = "input" | "img" | "br" | "hr" | "meta" | "link" | "base" | "col" | "area" | "embed" | "keygen" | "param" | "source" | "track" | "wbr";

declare type ChildDomType =
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
