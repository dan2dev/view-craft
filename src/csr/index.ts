import { selfClosingTags, tagNames } from "@/utility/tagNames";
import tag from "./tag";
import { setProp } from "@/utility/setProp";
// import { createSelfClosingTag } from "@/elements/browser-tags";

console.log("Client-side rendering!");

export function registerTags() {
  tagNames.forEach((tagName) => {
    setProp(
      globalThis,
      tagName,
      tag.tagBuilder(tagName)
    );
  });
  tag.tagBuilder = undefined;
  selfClosingTags.forEach((tagName) => {
    setProp(
      globalThis,
      tagName,
      selfClosingTagBuilder(tagName)
    );
  });
}
