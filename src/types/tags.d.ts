declare type TagName =  "div" | "h1" | "span";
declare type SelfClosingTagName = "input" | "img" | "br" | "hr" | "meta" | "link" | "base" | "col" | "area" | "embed" | "keygen" | "param" | "source" | "track" | "wbr";


declare global {
    declare interface Window {
        [tag: TagName]: string;
        [tag: SelfClosingTagName]: (...modifiers: ModifierFn<SelfClosingTagName>[]) => () => HTMLDivElement;
    }
    declare interface GlobalThis {
        [tag: TagName]: string;
    }
}

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