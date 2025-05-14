import { selfClosingTags, tags } from "@/utility/tags";
import { isBrowser } from "view-craft";
import { createTag } from "./browser-tags";


if (isBrowser) {
  for (const tag of tags) {
    Object.defineProperty(globalThis, tag, {
      value: createTag(tag),
      writable: false,
      enumerable: false,
      configurable: true,
    })
  }
  console.log("Hello World!!!!!");
} else {
  for (const tag of tags) {
    Object.defineProperty(globalThis, tag, {
      value: (...modifiers: ModifierFn<typeof tag>[]) => () => {



        `<${tag}></${tag}>`
      },
      writable: false,
      enumerable: false,
      configurable: true,
    })
  }
}
