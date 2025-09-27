/**
 * Ambient declarations for global style utilities (single source of truth).
 * Exposes w, h, bg, border, borderRadius, css, cn globally via a single declare global block.
 * Consumers should reference "view-craft/types" to include these types. Do not duplicate elsewhere.
 */

export {};

declare global {
  /**
   * CSS value accepted by utility functions.
   * Numbers generally map to px for size-related properties.
   */
  type VC_CSSValue = string | number;

  /**
   * Chainable style function that is also a NodeMod-like function.
   * It can be called as a modifier (parent, index?) and has chainable methods for styling.
   */
  type ViewCraftStyleChain = NodeModFn<any> & {
    // Add arbitrary CSS property/value pair
    add(key: string, value: VC_CSSValue): ViewCraftStyleChain;

    // Common utilities
    w(value: VC_CSSValue): ViewCraftStyleChain;
    h(value: VC_CSSValue): ViewCraftStyleChain;
    bg(value: VC_CSSValue): ViewCraftStyleChain;
    border(value: VC_CSSValue): ViewCraftStyleChain;
    borderRadius(value: VC_CSSValue): ViewCraftStyleChain;

    // Introspection
    classNames(): string;
    toString(): string;
  };

  type ViewCraftStyleUtil = (value: VC_CSSValue) => ViewCraftStyleChain;
  type ViewCraftCssUtil = (property: string, value: VC_CSSValue) => ViewCraftStyleChain;

  /**
   * Tailwind-like class builder input types (strings, numbers, arrays, conditional objects).
   */
  type ViewCraftCnArg = string | number | null | undefined | false | Record<string, any> | Array<any>;
  type ViewCraftCn = (...args: Array<ViewCraftCnArg | (() => ViewCraftCnArg) | (() => ViewCraftCnArg[])>) => NodeModFn<any>;

  // Global variables (available on globalThis/window)
  var w: ViewCraftStyleUtil;
  var h: ViewCraftStyleUtil;
  var bg: ViewCraftStyleUtil;
  var border: ViewCraftStyleUtil;
  var borderRadius: ViewCraftStyleUtil;
  var css: ViewCraftCssUtil;
  var cn: ViewCraftCn;

  interface Window {
    w: ViewCraftStyleUtil;
    h: ViewCraftStyleUtil;
    bg: ViewCraftStyleUtil;
    border: ViewCraftStyleUtil;
    borderRadius: ViewCraftStyleUtil;
    css: ViewCraftCssUtil;
    cn: ViewCraftCn;
  }

  interface globalThis {
    w: ViewCraftStyleUtil;
    h: ViewCraftStyleUtil;
    bg: ViewCraftStyleUtil;
    border: ViewCraftStyleUtil;
    borderRadius: ViewCraftStyleUtil;
    css: ViewCraftCssUtil;
    cn: ViewCraftCn;
  }
}