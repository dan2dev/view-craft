import { tags } from "../utility/tags";
import { createTag } from "./elementFactory";

export function registerGlobalTagBuilders() {
  console.time("-----tags creation-----");
  tags.forEach((tag) => {
    // @ts-ignore
    globalThis[tag] = createTag(tag);
  });
  console.timeEnd("-----tags creation-----");
}
