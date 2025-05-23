import { isDomChild } from "@/utility/isDomChild";
import { setProp } from "@/utility/setProp";
import { state } from "./state";

export const textBuilder = (text: string | number) => {
  return (parent: ChildNode, childIndex: number = 0): Text => {
    const r: Text = !state.hydrationComplete ? parent.childNodes[childIndex] as Text : document.createTextNode(text.toString());
    return r;
  }
}



export const tagBuilderModifier = <TTagName extends TagName = TagName>(parent: ChildNode, childIndex: number, mod: Modifier<TTagName>):
  ChildDomType | string | number | null | void => {
  let modResult: unknown = mod;
  let modType: ObjectType = typeof mod;
  let deepIndex = 0;
  let modFn: ((element: ChildNode, domIndex: number) => ChildDomType | string | number | null | void) | undefined;
  while (modType === "function") {
    modFn = modResult as (element: ChildNode, domIndex: number) => ChildDomType | string | number | null | void;
    modResult = (modResult as (element: ChildNode, domIndex: number) => HTMLElement)(parent, childIndex);
    modType = typeof modResult;
    deepIndex++;
    // if is not a dom child and it's an object. It should update the parent
    let update: ((event: Event) => void) | undefined;
    if (!isDomChild(modResult) && parent instanceof HTMLElement) {
      // update the parent attributes
      if (modType === "object") {
        update = (event: Event) => {
          const modResult = modFn!(parent, childIndex);
          Object.keys(modResult as object).forEach((key) => {
            (event.target as HTMLElement).setAttribute(key, (modResult as any)[key]);
          });
        }
      } else
        // update the text node content if it's a string or number
        if (modType === "string" || modType === "number" || modType === "bigint") {
          update = (event: Event) => {
            const modResult = modFn!(parent, childIndex);
            ((event.target as HTMLElement).childNodes[childIndex] as Text).textContent = modResult as string;
          }
        }
      setProp(modResult, "parent", () => modFn!(parent, childIndex));
    } else if (deepIndex === 2) {

    }
    update && parent.addEventListener("update", update);
  }

  if (modType === "undefined") {
    return null;
  }
  if (modType === "number" || modType === "bigint") {
    modResult = (modResult as number).toString();
    modType = "string";
  }
  if (modType === "string") {
    modResult = textBuilder(modResult as string)(parent, childIndex);
  }
  return modResult as ChildDomType;
}

export const tagBuilder = <TTagName extends TagName = TagName>(tagName: TTagName) => {
  return (...modifiers: ModifierFn<TTagName>[]) => {
    return (parent: HTMLElement, childIndex: number = 0) => {
      const element: ChildNode = !state.hydrationComplete ? parent.childNodes[childIndex] : document.createElement(tagName);
      const children = !state.hydrationComplete ? element.childNodes : [];
      let domIndex = 0;
      for (let modIndex = 0; modIndex < modifiers.length; modIndex++) {
        let modResult: ModifierFn<TagName> | ChildNode | ((element: ChildNode, domIndex: number) => HTMLElement) = modifiers[modIndex];
        let modType: ObjectType = typeof modResult;
        let modFunc: ((element: ChildNode, domIndex: number) => HTMLElement) | undefined = undefined;
        // first check if is a function
        if (modType === "function") {
          modFunc = modResult as (element: ChildNode, domIndex: number) => HTMLElement;
          modResult = (modResult as (element: ChildNode, domIndex: number) => HTMLElement)(element, domIndex);
          modType = typeof modResult;
          // ------------
          console.log("function 1", modResult);

        }
        if(modFunc) {
          
        }

        // update function, second check if is a function for update
        if (modType === "function") {
          modFunc = modResult as (element: ChildNode, domIndex: number) => HTMLElement;
          modResult = modFunc(element, domIndex);
          modType = typeof modResult;
          // ------------
          console.log("function 2", modResult);
          
        }
        // // check if is number
        // if (modType === "number") {
        //   mod = (mod as number).toString();
        //   modType = "string";
        // }
        // // if is string
        // if (modType === "string") {
        //   mod = children[domIndex] ? children[domIndex] : textBuilder(mod)(element, domIndex);
        // }
        // if (mod instanceof Text) {
        //   domIndex = domIndex + 2;
        //   if (state.hydrationComplete) {
        //     element.appendChild(mod);
        //     element.appendChild(document.createComment(`text-${domIndex}-${modIndex}`));
        //   }
        // } else if (mod instanceof Comment || mod instanceof HTMLElement || mod instanceof SVGElement) {
        //   if (state.hydrationComplete) {
        //     element.appendChild(mod);
        //   }
        //   domIndex = domIndex + 1;
        // }
      }
      return element;
    }
  }
}

