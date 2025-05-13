
export function isDomChild(node: ChildDomType): boolean {
  return node instanceof HTMLElement || node instanceof SVGElement || node instanceof MathMLElement || node instanceof Text || node instanceof Comment;
}
