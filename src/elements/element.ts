import { tags } from "@/utility/tags";
import {isBrowser} from "view-craft";

declare type TagName = keyof HTMLElementTagNameMap;



if (isBrowser) {

  for (const tag of tags) {
    globalThis[tag] = function() {
      return document.createElement(tag);
    };
  }
  console.log("Hello World!");
}
