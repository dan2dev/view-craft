// Type definitions for view-craft
// Project: view-craft
// Definitions by: Your Name <your.email@example.com>

// Export your main types here. Example:

// Element, SelfClosingElement, Text, Comment
export type VTagName = keyof HTMLElementTagNameMap;
export type VElementTag<TTagName extends VTagName = VTagName> = {
  tagName: TTagName; // tag name
  att: Partial<HTMLElementTagNameMap[TTagName]>;
} &
  Omit<Partial<HTMLElementTagNameMap[TTagName]>, 'tagName'> &
  Pick<HTMLElementTagNameMap[TTagName], 'tagName'>;

export type VElementTagFn = () => VElementTag;

// Add more types as needed for your API
export { }
