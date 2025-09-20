export const createTagAttributes = <TTagName extends keyof HTMLElementTagNameMap>(
  element: Partial<HTMLElementTagNameMap[TTagName]> & { [key: string]: unknown },
  attrs: ExpandedElementAttributes<TTagName>
) => {
  for (const key in attrs) {
    let value: unknown = attrs[key];
    if (typeof value === "function") {
      value = value();
    }
    if (value == null) continue;
    if (key in element) {
      // @ts-ignore
      element[key] = value;
    } else if (element instanceof Element) {
      element.setAttribute?.(key, value.toString());
    }
  }
};
