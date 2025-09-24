type StyleObject = Record<string, string>;
type AttributeValue = string | number | boolean | StyleObject;
type AttributeFunction = () => AttributeValue;

/**
 * Applies style properties to an element's style object
 */
function applyStyleProperties(element: ExpandedElement<any>, styleObj: StyleObject): void {
  if (!element.style || typeof styleObj !== 'object' || styleObj === null) {
    return;
  }
  
  for (const property in styleObj) {
    if (styleObj.hasOwnProperty(property)) {
      (element.style as any)[property] = styleObj[property];
    }
  }
}

/**
 * Sets an attribute value on an element using the appropriate method
 */
function setAttributeValue<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: keyof ExpandedElementAttributes<TTagName>,
  value: AttributeValue
): void {
  if (value == null) {
    return;
  }

  if (key === "style") {
    applyStyleProperties(element, value as StyleObject);
  } else if (key in element) {
    (element as any)[key] = value;
  } else if (element instanceof Element) {
    element.setAttribute?.(key as string, String(value));
  }
}

/**
 * Creates an update handler for reactive attributes
 */
function createUpdateHandler<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: keyof ExpandedElementAttributes<TTagName>,
  attributeFunction: AttributeFunction
): (event?: Event) => void {
  return (event?: Event) => {
    try {
      const newValue = attributeFunction();
      setAttributeValue(element, key, newValue);
    } catch (error) {
      console.error(`Error updating attribute "${String(key)}":`, error);
    }
  };
}

/**
 * Sets up reactive attribute that responds to update events
 */
function setupReactiveAttribute<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: keyof ExpandedElementAttributes<TTagName>,
  attributeFunction: AttributeFunction
): void {
  const updateHandler = createUpdateHandler(element, key, attributeFunction);
  
  // Set up event listener for future updates
  element.addEventListener?.("update", updateHandler);
  
  // Apply initial value
  updateHandler();
}

/**
 * Creates and applies attributes to a DOM element
 */
export function createTagAttributes<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attrs: ExpandedElementAttributes<TTagName>,
): void {
  const attributeKeys = Object.keys(attrs) as Array<keyof ExpandedElementAttributes<TTagName>>;
  
  for (const key of attributeKeys) {
    const value = attrs[key];
    
    if (typeof value === "function") {
      setupReactiveAttribute(element, key, value as AttributeFunction);
    } else {
      setAttributeValue(element, key, value as AttributeValue);
    }
  }
}