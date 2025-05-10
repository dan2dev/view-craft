declare type TagName = "div" | "span" | "h1";
declare type SelfClosingTagName = "input" | "img" | "br" | "hr" | "meta" | "link" | "base" | "col" | "area" | "embed" | "keygen" | "param" | "source" | "track" | "wbr";

declare type TagAttributes<TTagName extends TagName & SelfClosingTagName> = {
    ["div"]: {
        className: string;
        children: IHTMLElement[];
    };
    ["span"]: {
        className: string;
        children: IHTMLElement[];
    };
    ["h1"]: {
        className: string;
        children: IHTMLElement[];
    }
};