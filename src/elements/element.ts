declare type TagName = keyof HTMLElementTagNameMap;

// export function createTagBasic(tagName: )
let isNode: boolean = typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;
export function isSSR(): boolean {
  return typeof window === "undefined";
}
