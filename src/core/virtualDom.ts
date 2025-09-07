export class VElement implements ExpandedElement {
  public tagName: string;
  public rawAttributes: ElementAttributes = {};
  private vChildren: (unknown | ExpandedElement)[] = [];
  public rawMods?: NodeMod[];
  public mods?: (Primitive | ExpandedElement)[];

  public constructor(tagName: string, attributes: ElementAttributes = {}) {
    this.tagName = tagName;
    this.rawAttributes = attributes;
  }

  public appendChild<T extends Node>(child: T): T;
  public appendChild(child: unknown | ExpandedElement): unknown {
    this.vChildren.push(child);
    return child as unknown;
  }
}
