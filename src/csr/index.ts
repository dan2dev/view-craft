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
      value: (...modifiers: any[]) => {
        return (parent: HTMLElement, childIndex: number = -1) => {
          console.log(parent);
          const children = Array.from(parent.childNodes);
          console.log(children);

          const element = document.createElement(tagName);


          let domIndex = 0;
          for (let modIndex = 0; modIndex < modifiers.length; modIndex++) {
            const mod = modifiers[modIndex];
            const modType = typeof mod;
            if(!state.hydrationComplete) {
              
            } else {

            }
            if (modType === "string" || modType === "number") {
              const textNode = document.createTextNode(mod.toString());
              element.appendChild(textNode);
            }
            else if (modType === "function") {
              const result = mod(element, domIndex);
              if (result) {
                if (Array.isArray(result)) {
                  result.forEach((child) => {
                    element.appendChild(child);
                  });
                } else if (typeof result === "string" || typeof result === "number") {
                  const textNode = document.createTextNode(result.toString());
                  element.appendChild(textNode);
                } else if (result instanceof HTMLElement) {
                  element.appendChild(result);
                }
              }
            }



          }


          modifiers.forEach((modifier) => {
            if (typeof modifier === "string") {
              // buildParams.element.appendChild(document.createTextNode(modifier));
            }
          });

          return element;
        }
      },
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
}
