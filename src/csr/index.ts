import { tagNames } from "@/utility/tag-names";

console.log("Client-side rendering");

declare const globalThis: {
  [key: string]: any;
}
export function registerTags() {
  tagNames.forEach((tagName) => {
    globalThis[tagName] = function (...modifiers: any[]) {
      return function (parent, index) {
        const element = document.createElement(tagName);
        // Apply modifiers to the element
        modifiers.forEach((modifier) => {
          const result = modifier(parent, { parent, index });
          if (Array.isArray(result)) {
            result.forEach((child) => element.appendChild(child));
          } else if (result instanceof Node) {
            element.appendChild(result);
          } else if (typeof result === "string" || typeof result === "number") {
            element.textContent = String(result);
          }
        });
        return element;
      };
    }
  });
}



