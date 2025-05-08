declare type TagName = keyof HTMLElementTagNameMap;

export type VTagReturn<
    TTagName extends TagName = TagName,
    TParent extends IHTMLElement<TagName> | HTMLElement =
            | IHTMLElement<TagName>
        | HTMLElement,
> = (parent: TParent, index: number) => IHTMLElement<TTagName>;
