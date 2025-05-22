import { tagNames } from "@/utility/tagNames";
import { tagBuilder } from "./tag";
import { setProp } from "@/utility/setProp";

console.log("Client-side rendering!");

export function registerTags() {
  tagNames.forEach((tagName) => {
    setProp(
      globalThis,
      tagName,
      tagBuilder(tagName)
    );
  });
}
