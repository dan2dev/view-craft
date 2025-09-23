export function createTagAttributes<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attrs: ExpandedElementAttributes<TTagName>,
) {
  for (const key in attrs) {
    let value: unknown = attrs[key];
    if (typeof value === "function") {
      console.log("----");
      console.log(value);
      const originalFunction = value as Function;
      element.addEventListener?.("update", (e: Event) => {
        const newValue = originalFunction();
        if (key in element) {
          element[key as keyof typeof element] = newValue;
        } else if (key === "className") {
          // element.className = newValue;
        } else if (key === "style") {
          // element.style.cssText = newValue;
        } else {
          element.setAttribute?.(key, newValue);
        }
      });
      value = originalFunction();
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
