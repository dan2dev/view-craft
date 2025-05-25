import { DuoHtmlElement } from "./vDom/HtmlElement";

export const tagBuilder = <TTagName extends TagName = TagName>(tagName: TTagName) => {
  return (...modifiers: ModifierFn<TTagName>[]) => {
    return (parent: DuoHtmlElement, childIndex: number = 0) => {
      const element = new DuoHtmlElement(tagName);
      let domIndex = 0;
      modifiers.forEach((modifier) => {
        let modResult:ModifierFn<TTagName> | string | DuoHtmlElement | undefined | number = modifier;
        if (typeof modifier === "function") {
          modResult = modifier(element, domIndex);
        }
        if(!modResult) {
          return;
        }
        if(modResult instanceof DuoHtmlElement) {
          modResult = modResult.render();
        }
        if (typeof modResult !== "string") {
          modResult = modResult.toString();
        }
        element.appendChild(modResult);
        domIndex++;
        
      });
      return element.render();
    }
  }
}
