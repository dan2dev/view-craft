export const updateElementProps = <TElement extends HTMLElement>(
  element: TElement,
  props: Partial<TElement>) => {
  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      const value = props[prop];
      if (value === null || value === undefined) {
        element.removeAttribute(prop);
      } else if (typeof value === "function") {
        if (prop.startsWith("on")) {
          const eventName = prop.slice(2).toLowerCase() as keyof HTMLElementEventMap;
          element.addEventListener(eventName, value as EventListener);
          continue;
        } else {
          const parsedValue = value(element, props);
          if (parsedValue === null || parsedValue === undefined) {
            element.removeAttribute(prop);
          } else if (typeof parsedValue === "function") {
            element.setAttribute(prop, parsedValue(element, props));
          }
        }
      } else {
        element.setAttribute(prop, value.toString());
      }
    }
  }
};