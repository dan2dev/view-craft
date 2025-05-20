import { tagNames } from "@/utility/tag-names";

console.log("Client-side rendering!");

declare const globalThis: {
  [key in TagName]: any;
};
export function text() { }

export function registerTags() {
  tagNames.forEach((tagName) => {
    Object.defineProperty(globalThis, tagName, {
      value: (...modifiers: any[]) => {
        console.log(modifiers)
        return (parent: HTMLElement, childIndex: number = -1) => {
          console.log(parent);
          const children = Array.from(parent.childNodes);
          console.log(children);

          const element = document.createElement(tagName);


          let domIndex = 0;
          for (let modIndex = 0; modIndex < modifiers.length; modIndex++) {
            const mod = modifiers[modIndex];



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
