import { tags } from "../utility/tags";
import { createTag } from "./elementFactory";

export function registerGlobalTagBuilders(): void {
  console.time("-----tags creation-----");
  tags.forEach((tag: ElementTagName) => {
    // @ts-ignore
    globalThis[tag] = createTag(tag);
  });
  console.timeEnd("-----tags creation-----");
}
