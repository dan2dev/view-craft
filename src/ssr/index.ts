import { tagNames } from "@/utility/tagNames";
import { tagBuilder } from "./tag";
import { setProp } from "@/utility/setProp";

console.log("Server-side rendering!");

export function registerTags() {
  console.log("Server-side rendering!");
  tagNames.forEach((tagName) => {
    setProp(
      globalThis,
      tagName,
      tagBuilder(tagName)
    );
  });
}
