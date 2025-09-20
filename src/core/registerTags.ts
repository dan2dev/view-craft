import { tags } from "../utility/tags";
import { createTag } from "./elementFactory";

export function registerGlobalTagBuilders(): void {
  tags.forEach((tag: ElementTagName) => {
    // @ts-ignore
    globalThis[tag] = createTag(tag);
  });
}
