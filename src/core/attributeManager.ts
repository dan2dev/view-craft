import { isFunction } from "../utility/typeGuards";

type AttributeKey<TTagName extends ElementTagName> = keyof ExpandedElementAttributes<TTagName>;
type AttributeCandidate<TTagName extends ElementTagName> =
  ExpandedElementAttributes<TTagName>[AttributeKey<TTagName>];

type StyleAssignment = Partial<CSSStyleDeclaration>;
type AttributeValue = string | number | boolean | StyleAssignment;
type AttributeResolver = () => AttributeValue | null | undefined;
type StyleResolver = () => StyleAssignment | null | undefined;

const reactiveElements = new Set<Element>();

function isZeroArgFunction(value: unknown): value is () => unknown {
  return isFunction(value) && value.length === 0;
}

function trackReactiveElement<TTagName extends ElementTagName>(element: ExpandedElement<TTagName>): void {
  if (element instanceof Element) {
    reactiveElements.add(element);
  }
}

function assignInlineStyles<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  styles: StyleAssignment | null | undefined,
): void {
  if (!element.style || !styles) {
    return;
  }

  const style = element.style as CSSStyleDeclaration;

  Object.entries(styles).forEach(([property, propertyValue]) => {
    if (propertyValue == null) {
      style.removeProperty(property);
    } else {
      style.setProperty(property, String(propertyValue));
    }
  });
}

function assignDirectValue<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: AttributeKey<TTagName>,
  value: AttributeValue | null | undefined,
): void {
  if (value == null) {
    return;
  }

  if (key === "style") {
    assignInlineStyles(element, value as StyleAssignment);
    return;
  }

  if (key in element) {
    (element as Record<string, unknown>)[key as string] = value;
    return;
  }

  if (element instanceof Element) {
    element.setAttribute(String(key), String(value));
  }
}

function registerAttributeResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: AttributeKey<TTagName>,
  resolver: AttributeResolver,
): void {
  trackReactiveElement(element);
  const handler = () => {
    try {
      const nextValue = resolver();
      assignDirectValue(element, key, nextValue as AttributeValue);
    } catch (error) {
      console.error(`Error updating attribute "${String(key)}"`, error);
    }
  };

  element.addEventListener?.("update", handler);
  handler();
}

function registerStyleResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  resolver: StyleResolver,
): void {
  trackReactiveElement(element);
  const handler = () => {
    try {
      assignInlineStyles(element, resolver());
    } catch (error) {
      console.error("Error updating style attribute:", error);
    }
  };

  element.addEventListener?.("update", handler);
  handler();
}

function applyStyleCandidate<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  candidate: ExpandedElementAttributes<TTagName>["style"],
): void {
  if (candidate == null) {
    return;
  }

  if (isZeroArgFunction(candidate)) {
    registerStyleResolver(element, candidate as StyleResolver);
    return;
  }

  assignInlineStyles(element, candidate as StyleAssignment);
}

function applyAttributeCandidate<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: AttributeKey<TTagName>,
  candidate: AttributeCandidate<TTagName>,
): void {
  if (candidate == null) {
    return;
  }

  if (key === "style") {
    applyStyleCandidate(element, candidate as ExpandedElementAttributes<TTagName>["style"]);
    return;
  }

  if (isZeroArgFunction(candidate)) {
    registerAttributeResolver(element, key, candidate as AttributeResolver);
    return;
  }

  assignDirectValue(element, key, candidate as AttributeValue);
}

/**
 * Applies attribute candidates to the provided element, wiring up reactive values when necessary.
 */
export function applyAttributes<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attributes: ExpandedElementAttributes<TTagName>,
): void {
  for (const key in attributes) {
    if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
      continue;
    }

    const typedKey = key as AttributeKey<TTagName>;
    const candidate = attributes[typedKey] as AttributeCandidate<TTagName> | undefined;
    if (candidate == null) {
      continue;
    }

    applyAttributeCandidate(element, typedKey, candidate as AttributeCandidate<TTagName>);
  }
}

/**
 * Dispatches update events to all registered reactive elements.
 */
export function notifyReactiveElements(): void {
  const staleElements: Element[] = [];

  reactiveElements.forEach((element) => {
    if (!element.isConnected) {
      staleElements.push(element);
      return;
    }

    element.dispatchEvent(new Event("update", { bubbles: true }));
  });

  staleElements.forEach((element) => reactiveElements.delete(element));
}
