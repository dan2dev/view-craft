import { state } from "@/csr/state";
import { isBrowser } from "@/utility/isBrowser";
import { setProp } from "@/utility/setProp";


export class DuoHtmlElement<TTagName extends string = string> {
  tagName: TTagName;
  children: Array<DuoHtmlElement | string>;
  constructor(tagName: TTagName) {
    this.tagName = tagName;
    this.children = [];
  }
  public appendChild(child: DuoHtmlElement | string): void {
    this.children.push(child);
  }

  public render(): string {
    let html = `<${this.tagName}>`;

    for (const child of this.children) {
      if (typeof child === "string") {
        html += child;
      } else {
        html += child.render();
      }
    }

    html += `</${this.tagName}>`;

    return html;
  }
  public toString(): string {
    return this.render();
  }
}

if (!isBrowser) {
  setProp(
    globalThis,
    "HTMLElement",
    DuoHtmlElement
  );
}
