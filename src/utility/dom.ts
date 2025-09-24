/**
 * Converts camelCase CSS property names to kebab-case.
 * Example: fontSize -> font-size, backgroundColor -> background-color
 */
export function camelToKebab(camelCase: string): string {
  return camelCase.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/**
 * Appends the provided children to the parent element, coercing strings into text nodes.
 */
export function appendChildren(parent: HTMLElement, ...children: Array<HTMLElement | string>): HTMLElement {
  children.forEach((child) => {
    const node = typeof child === "string" ? document.createTextNode(child) : child;
    parent.appendChild(node);
  });

  return parent;
}
