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
        if (key === "style") {
          for (const [property, v] of Object.entries(newValue as Record<string, string>)) {
            element.style[property] = v;
          }
          // element.style?.setProperty("font-size", "50px");
        } else if (key in element) {
          element[key as keyof typeof element] = newValue;
        } else if (key === "className") {
          // element.className = newValue;
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
