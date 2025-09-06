
export class VElement implements ExpandedElement {
  public tagName: string;
  public rawAttributes: ElementAttributes = {};
  public constructor(tagName: string, attributes: ElementAttributes = {}) {
    this.tagName = tagName;
    this.rawAttributes = attributes;
  }
}