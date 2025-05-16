export * from "./utility/isBrowser";
// import "../types/index.d.ts";
// console.log("ok");

declare function div2(...modifiers: ModifierFn<"div">[]): (parent: any, index: number) => HTMLDivElement | IHTMLElement<"div">;
declare global {
  function div(...modifiers: ModifierFn<"div">[]): (parent: any, index: number) => HTMLDivElement | IHTMLElement<"div">;
  function h1(...modifiers: ModifierFn<"h1">[]): (parent: any, index: number) => HTMLHeadingElement | IHTMLElement<"h1">;

}
export const something = "ok";
// import "./global.d.ts";
// export * from "./global.d.ts";
// export * from "./utility/isBrowser.ts";
// import "@/elements/element.ts";
// import "@/utility/tags.ts";
