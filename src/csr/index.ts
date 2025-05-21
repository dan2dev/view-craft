import { tagNames } from "@/utility/tag-names";
import { state } from "./state";
import { tagBuilder } from "./tag";

console.log("Client-side rendering!");

// declare const globalThis: {
//   [key in TagName]: any;
// };


export function registerTags() {
  tagNames.forEach((tagName) => {
    Object.defineProperty(globalThis, tagName, {
      value: tagBuilder(tagName),
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
}
