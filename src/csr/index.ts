import { tagNames } from "@/utility/tag-names";

console.log("Client-side rendering!");

declare const globalThis: {
  [key in TagName]: any;
};
export function text() {}

export function registerTags() {
  tagNames.forEach((tagName) => {
    Object.defineProperty(globalThis, tagName, {
      value: function (...modifiers: any[]) {
        return function (buildParams: {
          parent: HTMLElement;
          element: HTMLElement | Text | Comment;
        }) {
          // modifiers.forEach



          modifiers.forEach((modifier) => {
            if (typeof modifier === "string") {
              buildParams.element.appendChild(document.createTextNode(modifier));
            }
          });

          return buildParams.element;
        }
      },
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
}
