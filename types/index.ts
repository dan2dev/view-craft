// Type definitions for view-craft
// Project: view-craft
// Definitions by: Your Name <your.email@example.com>

import {  Merge, MergeDeep, OmitDeep, PickDeep } from "type-fest";

// Export your main types here. Example:

// Element, SelfClosingElement, Text, Comment
declare global {
  export type VTagName = keyof HTMLElementTagNameMap;
  export type VElementTag<TTagName extends VTagName = VTagName> = Merge<{
    tagName: TTagName; // tag name
    att: Partial<HTMLElementTagNameMap[TTagName]>;
  }, Omit<Partial<HTMLElementTagNameMap[TTagName]>, "tagName">>;

  export type VElementTagBuilderFn = () => VElementTag | number;
}

// Add more types as needed for your API
export { };
