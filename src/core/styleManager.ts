import { isFunction } from "../utility/typeGuards";
import { registerAttributeResolver } from "./reactive";

type StyleAssignment = Partial<CSSStyleDeclaration>;
type StyleResolver = () => StyleAssignment | null | undefined;

function isZeroArgFunction(value: unknown): value is () => unknown {
  return isFunction(value) && value.length === 0;
}

/**
 * Applies inline styles to an element.
 */
export function assignInlineStyles<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  styles: StyleAssignment | null | undefined,
): void {
  if (!element.style || !styles) {
    return;
  }

  const style = element.style as CSSStyleDeclaration;

  Object.entries(styles).forEach(([property, propertyValue]) => {
    if (propertyValue == null) {
      if (property in style) {
        (style as unknown as Record<string, string>)[property] = '';
      } else {
        style.removeProperty(property);
      }
    } else {
      if (property in style) {
        (style as unknown as Record<string, string>)[property] = String(propertyValue);
      } else {
        style.setProperty(property, String(propertyValue));
      }
    }
  });
}

/**
 * Registers a style resolver for reactive updates.
 */
function registerStyleResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  resolver: StyleResolver,
): void {
  registerAttributeResolver(
    element,
    "style",
    resolver,
    (styles) => assignInlineStyles(element, styles as StyleAssignment)
  );
}

/**
 * Applies style attribute with support for reactive updates.
 */
export function applyStyleAttribute<TTagName extends ElementTagName>(
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