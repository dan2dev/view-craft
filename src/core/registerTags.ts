import { tags } from "../utility/tags";
import { createTag } from "./elementFactory";

export function registerGlobalTagBuilders() {
  tags.forEach((tag) => {
    // @ts-ignore
    globalThis[tag] = createTag(tag);
  });
}
