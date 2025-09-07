// export class VDocument implements Partial<Document> {

import isBrowser from "../utility/isBrowser";


//   public createElement(tagName: string): ExpandedElement {
//     return new VElement(tagName) as ExpandedElement;
//   }
// }

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

export const createElement = <TTagName extends keyof HTMLElementTagNameMap>(
  tagName: TTagName,
): ExpandedElement<TTagName> => {
  const element = (
    isBrowser
      ? (document.createElement(tagName) as ExpandedElement<TTagName>)
      : (new VElement(String(tagName)) as unknown as ExpandedElement<TTagName>)
  );
  return element as ExpandedElement<TTagName>;
}
