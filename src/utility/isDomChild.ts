
export function isDomChild(node: any): boolean {
  return node instanceof HTMLElement || node instanceof Text || node instanceof SVGElement || node instanceof MathMLElement || node instanceof Comment;
}
