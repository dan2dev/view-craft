import { setupReactiveAttribute, setAttributeValue } from "../utility";

type AttributeValue = string | number | boolean | Record<string, string>;
type AttributeFunction = () => AttributeValue;

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