import { isBrowser } from "./utility/isBrowser";

export * from "./utility/isBrowser";
// import "../types/index.d.ts";
// console.log("ok");

if (isBrowser) {
  import("./csr/index.ts").then((module) => {
    console.log(module);
    console.log("ok");
  }
  );
}

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
