import { isBrowser } from "./isBrowser";

export function isDomChild<T>(node: T): boolean {
  if (!isBrowser) return false;
  return (
    node instanceof HTMLElement ||
    node instanceof Text ||
    node instanceof SVGElement ||
    node instanceof MathMLElement ||
    node instanceof Comment
  );
}
