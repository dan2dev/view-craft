export function createTagAttributes<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attrs: ExpandedElementAttributes<TTagName>,
) {
  for (const key of Object.keys(attrs) as Array<
    keyof ExpandedElementAttributes<TTagName>
  >) {
    let value: unknown = attrs[key];
    if (typeof value === "function") {
      console.log("----");
      console.log(value);
      const originalFunction = value as Function;
      element.addEventListener?.("update", (_e: Event) => {
        const newValue = originalFunction();
        if (key === "style") {
          const styleObj = newValue as Record<string, string>;
          if (element.style) {
            for (const property in styleObj) {
              // property is string, but element.style[property] is not type-safe
              (element.style as any)[property] = styleObj[property];
            }
          }
          // element.style?.setProperty("font-size", "50px");
        } else if (key in element) {
          (element as any)[key] = newValue;
        } else if (key === "className") {
          // element.className = newValue;
        } else {
          element.setAttribute?.(key as string, newValue as string);
        }
      });
      value = originalFunction();
    }
    if (value == null) continue;
    if (key in element) {
      // @ts-ignore (setting property directly on HTMLElement)
      (element as any)[key] = value;
    } else if (element instanceof Element) {
      element.setAttribute?.(key as string, value.toString());
    }
  }
}
