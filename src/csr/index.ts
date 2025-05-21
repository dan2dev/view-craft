import { tagNames } from "@/utility/tag-names";
import { state } from "./state";

console.log("Client-side rendering!");

declare const globalThis: {
  [key in TagName]: any;
};
export function text() { }

export function registerTags() {
  tagNames.forEach((tagName) => {
    Object.defineProperty(globalThis, tagName, {
      value: (...modifiers: ModifierFn<TagName>[]) => {
        return (parent: HTMLElement, childIndex: number = 0) => {
          console.log(parent, parent.childNodes, childIndex, tagName);
          const element = !state.hydrationComplete ? Array.from(parent.childNodes)[childIndex] : document.createElement(tagName);
          if (!element) {
            return;
          }
          console.log("element", element);
          const children = !state.hydrationComplete && element.hasChildNodes() ? element.childNodes : [];
          let domIndex = 0;
          for (let modIndex = 0; modIndex < modifiers.length; modIndex++) {
            let mod: any = modifiers[modIndex];
            let modType = typeof mod;
            if (modType === "function") {
              mod = mod(element, domIndex);
              modType = typeof mod;
            }
            // check if is number
            if (modType === "number") {
              mod = mod.toString();
              modType = "string";
            }
            // if is string
            if (modType === "string") {
              mod = children[domIndex] ? children[domIndex] : document.createTextNode(mod);
            }
            if (mod instanceof Text) {
              domIndex = domIndex + 2;
              if (state.hydrationComplete) {
                element.appendChild(mod);
                element.appendChild(document.createComment("--"));
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
      },
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
}
