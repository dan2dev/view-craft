import { isFunction } from "../utility/typeGuards";
import { registerAttributeResolver } from "./reactive";
import { logError, handleDOMError, withErrorHandling } from "../utility/errorHandler";

type StyleAssignment = Partial<CSSStyleDeclaration>;
type StyleResolver = () => StyleAssignment | null | undefined;
type StyleProperty = keyof CSSStyleDeclaration;

/**
 * Checks if a value is a zero-argument function
 */
function isZeroArgFunction(value: unknown): value is () => unknown {
  return isFunction(value) && value.length === 0;
}

/**
 * Safely sets a single CSS property on an element
 */
function setStyleProperty(
  style: CSSStyleDeclaration,
  property: string,
  value: string | null
): boolean {
  try {
    if (!style) {
      return false;
    }

    if (value == null || value === '') {
      // Remove the property
      if (property in style) {
        (style as unknown as Record<string, string>)[property] = '';
      } else {
        style.removeProperty(property);
      }
    } else {
      // Set the property
      if (property in style) {
        (style as unknown as Record<string, string>)[property] = value;
      } else {
        style.setProperty(property, value);
      }
    }

    return true;
  } catch (error) {
    logError(
      `Failed to set CSS property "${property}"`,
      error,
      {
        operation: "setStyleProperty",
        additionalInfo: {
          property,
          value: value?.slice(0, 100), // Truncate long values
        }
      },
      "warn"
    );
    return false;
  }
}

/**
 * Validates CSS property names to prevent potential security issues
 */
function isValidCSSProperty(property: string): boolean {
  // Basic validation - reject obviously malicious patterns
  if (!property || typeof property !== "string") {
    return false;
  }

  // Reject properties with suspicious characters
  if (property.includes('<') || property.includes('>') || property.includes('"')) {
    return false;
  }

  // Must be reasonable length
  if (property.length > 100) {
    return false;
  }

  return true;
}

/**
 * Validates CSS property values to prevent potential security issues
 */
function isValidCSSValue(value: unknown): boolean {
  if (value == null) {
    return true; // null/undefined are valid (will remove property)
  }

  const stringValue = String(value);

  // Reject obviously malicious patterns
  if (stringValue.includes('<script') || stringValue.includes('javascript:')) {
    return false;
  }

  // Must be reasonable length
  if (stringValue.length > 1000) {
    return false;
  }

  return true;
}

/**
 * Applies inline styles to an element with enhanced safety and error handling
 */
export function assignInlineStyles<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  styles: StyleAssignment | null | undefined,
): void {
  if (!element || !styles) {
    return;
  }

  if (!element.style) {
    logError(
      "Element does not support style property",
      new Error("Missing style property"),
      {
        operation: "assignInlineStyles",
        tagName: element.tagName?.toLowerCase(),
      },
      "warn"
    );
    return;
  }

  const style = element.style as CSSStyleDeclaration;
  let successCount = 0;
  let errorCount = 0;

  try {
    Object.entries(styles).forEach(([property, propertyValue]) => {
      // Validate property name
      if (!isValidCSSProperty(property)) {
        logError(
          `Invalid CSS property name: "${property}"`,
          new Error("Property validation failed"),
          {
            operation: "assignInlineStyles",
            tagName: element.tagName?.toLowerCase(),
            additionalInfo: { property }
          },
          "warn"
        );
        errorCount++;
        return;
      }

      // Validate property value
      if (!isValidCSSValue(propertyValue)) {
        logError(
          `Invalid CSS property value for "${property}"`,
          new Error("Value validation failed"),
          {
            operation: "assignInlineStyles",
            tagName: element.tagName?.toLowerCase(),
            additionalInfo: { property, value: String(propertyValue).slice(0, 100) }
          },
          "warn"
        );
        errorCount++;
        return;
      }

      // Apply the style
      const success = setStyleProperty(
        style,
        property,
        propertyValue == null ? null : String(propertyValue)
      );

      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    });
  } catch (error) {
    handleDOMError(error, "assignInlineStyles", element as Element);
  }

  // Log summary if there were errors
  if (errorCount > 0) {
    logError(
      `Style assignment completed with errors`,
      new Error("Style assignment partial failure"),
      {
        operation: "assignInlineStyles",
        tagName: element.tagName?.toLowerCase(),
        additionalInfo: {
          successCount,
          errorCount,
          totalStyles: Object.keys(styles).length
        }
      },
      "info"
    );
  }
}

/**
 * Creates a safe style resolver wrapper that handles errors
 */
function createSafeStyleResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  resolver: StyleResolver
): () => void {
  return withErrorHandling(
    () => {
      const styles = resolver();
      assignInlineStyles(element, styles);
    },
    {
      operation: "styleResolver",
      tagName: element.tagName?.toLowerCase(),
    }
  );
}

/**
 * Registers a style resolver for reactive updates with enhanced error handling
 */
function registerStyleResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  resolver: StyleResolver,
): void {
  try {
    registerAttributeResolver(
      element,
      "style",
      resolver,
      (styles) => {
        try {
          assignInlineStyles(element, styles as StyleAssignment);
        } catch (error) {
          handleDOMError(error, "styleResolverCallback", element as Element);
        }
      }
    );
  } catch (error) {
    logError(
      "Failed to register style resolver",
      error,
      {
        operation: "registerStyleResolver",
        tagName: element.tagName?.toLowerCase(),
      }
    );
  }
}

/**
 * Applies style attribute with support for reactive updates and enhanced safety
 */
export function applyStyleAttribute<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  candidate: ExpandedElementAttributes<TTagName>["style"],
): void {
  if (candidate == null) {
    return;
  }

  if (!element) {
    logError(
      "Cannot apply style to null/undefined element",
      new Error("Invalid element"),
      { operation: "applyStyleAttribute" },
      "warn"
    );
    return;
  }

  try {
    if (isZeroArgFunction(candidate)) {
      registerStyleResolver(element, candidate as StyleResolver);
    } else {
      assignInlineStyles(element, candidate as StyleAssignment);
    }
  } catch (error) {
    handleDOMError(error, "applyStyleAttribute", element as Element);
  }
}

/**
 * Clears all inline styles from an element
 */
export function clearInlineStyles<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>
): boolean {
  if (!element || !element.style) {
    return false;
  }

  try {
    if (element.style.cssText !== undefined) {
      element.style.cssText = '';
    } else {
      // Fallback: remove attribute
      if ('removeAttribute' in element) {
        (element as unknown as Element).removeAttribute('style');
      }
    }
    return true;
  } catch (error) {
    handleDOMError(error, "clearInlineStyles", element as Element);
    return false;
  }
}

/**
 * Gets the computed style value for a specific property
 */
export function getComputedStyleValue(
  element: Element,
  property: string
): string | null {
  if (!element || !property || !isValidCSSProperty(property)) {
    return null;
  }

  try {
    if (typeof getComputedStyle === 'undefined') {
      return null;
    }

    const computedStyle = getComputedStyle(element);
    return computedStyle.getPropertyValue(property) || null;
  } catch (error) {
    handleDOMError(error, "getComputedStyleValue", element);
    return null;
  }
}