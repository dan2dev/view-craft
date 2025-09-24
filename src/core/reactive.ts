type TextResolver = () => Primitive;
type AttributeResolver = () => unknown;

const reactiveElements = new Set<Element>();
const reactiveTextNodes = new Map<Text, TextResolver>();

/**
 * Tracks an element for reactive updates.
 */
export function trackReactiveElement<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>
): void {
  if (element instanceof Element) {
    reactiveElements.add(element);
  }
}

/**
 * Creates a reactive text node that updates its content when update() is called.
 */
export function createReactiveTextNode(resolver: TextResolver): Text {
  const textNode = document.createTextNode("");
  reactiveTextNodes.set(textNode, resolver);
  
  try {
    const value = resolver();
    textNode.textContent = value == null ? String(value) : String(value);
  } catch (error) {
    console.error("Error initializing reactive text node:", error);
    textNode.textContent = "";
  }
  
  return textNode;
}

/**
 * Registers an attribute resolver for reactive updates.
 */
export function registerAttributeResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: keyof ExpandedElementAttributes<TTagName>,
  resolver: AttributeResolver,
  applyValue: (value: unknown) => void
): void {
  trackReactiveElement(element);
  const handler = () => {
    try {
      const nextValue = resolver();
      applyValue(nextValue);
    } catch (error) {
      console.error(`Error updating attribute "${String(key)}"`, error);
    }
  };

  element.addEventListener?.("update", handler);
  handler();
}

/**
 * Updates all reactive text nodes with their latest values.
 */
export function notifyReactiveTextNodes(): void {
  const staleTextNodes: Text[] = [];

  reactiveTextNodes.forEach((resolver, textNode) => {
    if (!textNode.isConnected) {
      staleTextNodes.push(textNode);
      return;
    }

    try {
      const value = resolver();
      const newContent = value == null ? String(value) : String(value);
      textNode.textContent = newContent;
    } catch (error) {
      console.error("Error updating reactive text node:", error);
    }
  });

  staleTextNodes.forEach((textNode) => reactiveTextNodes.delete(textNode));
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