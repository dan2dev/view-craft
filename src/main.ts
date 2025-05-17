export * from "./utility/isBrowser";
import { isBrowser } from "./utility/isBrowser";

const registerTags = isBrowser
  ? () => import("./csr/index.ts").then((csr) => csr.registerTags())
  : () => Promise.resolve();

registerTags();


globalThis.div = function (...modifiers) {
  return function (parent, index) {
    const element = document.createElement("div");
    return element;
  }
}

export const something = "ok2";
// import "./global.d.ts";
// export * from "./global.d.ts";
// export * from "./utility/isBrowser.ts";
// import "@/elements/element.ts";
// import "@/utility/tags.ts";
export {
  isBrowser,
}
