export function createTagAttributes<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attrs: ExpandedElementAttributes<TTagName>
) {
  for (const key in attrs) {
    let value: unknown = attrs[key];
    if (typeof value === "function") {
      value = value();
    }
    if (value == null) continue;
    if (key in element) {
      // @ts-ignore (setting property directly on HTMLElement)
      element[key] = value;
    } else if (element instanceof Element) {
      element.setAttribute?.(key, value.toString());
    }
  }
}
