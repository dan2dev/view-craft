import { state } from "./state";
export const textBuilder = (text: string | number) => {
  return (parent: ChildNode, childIndex: number = 0): Text => {
    const r: Text = !state.hydrationComplete ? parent.childNodes[childIndex] as Text : document.createTextNode(text.toString());
    return r;
  }
}

export const buildChildren = (parent: ChildNode, childIndex: number, mod: Modifier<TagName>): HTMLElement | Text | null | undefined | void => {
  let modResult: ModifierFn | HTMLElement | Text | Comment | (HTMLElement | Text | Comment)[] = mod;
  while (typeof mod === "function") {
    modResult = (mod as (element: ChildNode, domIndex: number) => HTMLElement)(parent, childIndex);
  }
  return modResult;
}

export const tagBuilder = <TTagName extends TagName = TagName>(tagName: TTagName) => {
  return (...modifiers: ModifierFn<TTagName>[]) => {
    return (parent: HTMLElement, childIndex: number = 0) => {
      const element: ChildNode = !state.hydrationComplete ? parent.childNodes[childIndex] : document.createElement(tagName);
      const children = !state.hydrationComplete ? element.childNodes : [];
      let domIndex = 0;
      for (let modIndex = 0; modIndex < modifiers.length; modIndex++) {
        let mod: ModifierFn<TagName> | ChildNode | ((element: ChildNode, domIndex: number) => HTMLElement) = modifiers[modIndex];
        let modType: ObjectType = typeof mod;
        if (modType === "function") {
          mod = (mod as (element: ChildNode, domIndex: number) => HTMLElement)(element, domIndex);
          modType = typeof mod;
        }
        // check if is number
        if (modType === "number") {
          mod = (mod as number).toString();
          modType = "string";
        }
        // if is string
        if (modType === "string") {
          mod = children[domIndex] ? children[domIndex] : textBuilder(mod)(element, domIndex);
        }
        if (mod instanceof Text) {
          domIndex = domIndex + 2;
          if (state.hydrationComplete) {
            element.appendChild(mod);
            element.appendChild(document.createComment(`text-${domIndex}-${modIndex}`));
          }
        } else if (mod instanceof Comment || mod instanceof HTMLElement || mod instanceof SVGElement) {
          if (state.hydrationComplete) {
            element.appendChild(mod);
          }
          domIndex = domIndex + 1;
        }
      }
      return element;
    }
  }
}

