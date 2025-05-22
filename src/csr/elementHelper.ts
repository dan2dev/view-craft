/**
 * Updates an element's properties efficiently using appropriate strategies
 * for different value types (null, functions, event handlers, regular values)
 */

export const setElementProps = <TElement extends HTMLElement>(
  element: TElement,
  props: { [propName: string]: string | number | boolean | (() => string | number | boolean) }) => {
  Object.keys(props).forEach((prop) => {
    const value = props[prop] as string | number | boolean | (() => string | number | boolean);
    if (typeof value === 'function') {
      handleFunctionProp(element, prop, value);
    } else {
      handleValueProp(element, prop, value);
    }
  });
};

const handleValueProp = <TElement extends HTMLElement>(
  element: TElement,
  prop: string,
  value: string | number | boolean,
) => {

  if (typeof value === 'boolean') {
    if (value) {
      element.setAttribute(prop, '');
    } else {
      element.removeAttribute(prop);
    }
    return;
  }


  if (value != null) {
    element.setAttribute(prop, String(value));
  } else {
    element.removeAttribute(prop);
  }
}

/**
 * Specialized handler for function properties
 */
const handleFunctionProp = <TElement extends HTMLElement>(
  element: TElement,
  prop: string,
  value: Function,

) => {

  if (prop.startsWith('on')) {
    const eventName = prop.slice(2).toLowerCase() as keyof HTMLElementEventMap;
    element.addEventListener(eventName, value as EventListener);
    return;
  }


  const parsedValue = value(element);


  if (parsedValue == null) {
    element.removeAttribute(prop);
    return;
  }


  element.setAttribute(prop, String(parsedValue));
};