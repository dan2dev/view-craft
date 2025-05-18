import { tagNames } from "@/utility/tag-names";

console.log("Client-side rendering!!!!");

declare const globalThis: {
  [key in TagName]: any;
}
export function registerTags() {
  tagNames.forEach((tagName) => {
    globalThis[tagName] = function (...modifiers: any[]) {
      console.log("new tag");
      const element = document.createElement(tagName);
      modifiers.forEach((modifier) => {
        // Check if the modifier is a function
        if (typeof modifier === "string") {
          element.appendChild(document.createTextNode(modifier));
        }
      });

      return function (parent: any) {
        // Apply modifiers to the element
        // modifiers.forEach((modifier) => {
        //   const result = modifier(parent, { parent });
        //   if (Array.isArray(result)) {
        //     result.forEach((child) => element.appendChild(child));
        //   } else if (result instanceof Node) {
        //     element.appendChild(result);
        //   } else if (typeof result === "string" || typeof result === "number") {
        //     element.textContent = String(result);
        //   }
        // });
        return element;
      };
    }
  });
}



