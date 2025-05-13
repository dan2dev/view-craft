
export const tags: TagName[] = [
    "div",
    "h1",
    "span"
]


export const selfClosingTags: SelfClosingTagName[] = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]

export function initBrowserTags() {
    if (typeof window === "undefined") {
        throw new Error("window is not defined");
    }
    tags.forEach((tag) => {
    });

}