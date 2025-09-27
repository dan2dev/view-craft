/**
 * Utility-first styling with CSSStyleSheet API and chainable functions.
 *
 * Goals:
 * - Tailwind-like utilities via functions: w("100px").h("200px").bg("blue").border("...").borderRadius("5px")
 * - NodeModFn-compatible: the chain is a function (parent, index) => void that can be used as a modifier
 * - Global availability: utilities are attached to globalThis (w, h, bg, border, borderRadius)
 * - No duplicate CSS rules: each (property,value) pair produces a single class in a shared stylesheet
 *
 * Implementation notes:
 * - Utilities generate deterministic class names (based on hashed "prop:value") and insert rules via CSSStyleSheet.insertRule.
 * - The chain applies classes via element.classList.add to avoid clobbering other classes.
 */

// ---- CSS Stylesheet registry (singleton) ----

type CSSValue = string | number;

const STYLE_ELEMENT_ID = "view-craft-styles";
const CLASS_PREFIX = "vc"; // short, avoids collisions and keeps classes compact

// Map from "prop:value" -> className
const ruleCache = new Map<string, string>();

// Lazily create/retrieve a CSSStyleSheet. Uses a <style> element and CSSStyleSheet API (insertRule).
function getOrCreateStyleSheet(): CSSStyleSheet | null {
  if (typeof document === "undefined") return null;

  let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ELEMENT_ID;
    // Keep it early in head so it's easy to override if needed
    document.head.appendChild(styleEl);
  }
  return styleEl.sheet as CSSStyleSheet;
}

function hash(input: string): string {
  // djb2 variant (xor) -> base36
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h << 5) + h) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

function propAbbrev(prop: string): string {
  switch (prop) {
    case "width": return "w";
    case "height": return "h";
    case "background-color": return "bg";
    case "border": return "b";
    case "border-radius": return "br";
    default: return prop.replace(/[^a-z0-9]+/gi, "-");
  }
}

function ensureCssRule(property: string, value: string): string {
  const key = `${property}:${value}`;
  const cached = ruleCache.get(key);
  if (cached) return cached;

  const cls = `${CLASS_PREFIX}-${propAbbrev(property)}-${hash(key)}`;
  const sheet = getOrCreateStyleSheet();

  // Insert the rule if possible (browser); on SSR we just cache the class for later use.
  if (sheet) {
    const rule = `.${cls} { ${property}: ${value}; }`;
    try {
      sheet.insertRule(rule, sheet.cssRules.length);
    } catch {
      // Swallow invalid CSS. Still return the class to avoid throwing in user code.
      // If rule is invalid, the class won't apply any effect.
    }
  }

  ruleCache.set(key, cls);
  return cls;
}

// ---- Utility mapping and normalization ----

const cssPropertyMap: Record<string, string> = {
  w: "width",
  h: "height",
  bg: "background-color",
  border: "border",
  borderRadius: "border-radius",
};

const pxProps = new Set<string>(["width", "height", "border-radius"]);

function cssPropertyFor(key: string): string {
  return cssPropertyMap[key] ?? key;
}

function normalizeValue(property: string, value: CSSValue): string {
  if (value == null as any) return "";
  if (typeof value === "number") {
    return pxProps.has(property) ? `${value}px` : String(value);
  }
  return value;
}

// ---- Style chain (NodeModFn-compatible function object) ----

type StyleChain = NodeModFn<any> & {
  add: (key: string, value: CSSValue) => StyleChain;
  w: (value: CSSValue) => StyleChain;
  h: (value: CSSValue) => StyleChain;
  bg: (value: CSSValue) => StyleChain;
  border: (value: CSSValue) => StyleChain;
  borderRadius: (value: CSSValue) => StyleChain;
  classNames: () => string;
  toString: () => string;
};

function createChain(): StyleChain {
  const classSet = new Set<string>();

  const chain = ((parent: ExpandedElement<any>) => {
    if (!parent || classSet.size === 0) return null;

    const classes = Array.from(classSet);
    try {
      if ((parent as any).classList && typeof (parent as any).classList.add === "function") {
        (parent as any).classList.add(...classes);
      } else {
        // Fallback for environments without classList
        const existing = ((parent as any).className ?? "").toString().trim();
        const merged = (existing ? existing.split(/\s+/) : []).concat(classes);
        const unique = Array.from(new Set(merged)).join(" ").trim();
        (parent as any).className = unique;
      }
    } catch {
      // Non-fatal; ignore if the element cannot be styled
    }
    return null;
  }) as unknown as StyleChain;

  const add = (key: string, val: CSSValue): StyleChain => {
    if (val == null as any) return chain;
    const property = cssPropertyFor(key);
    const cssVal = normalizeValue(property, val);
    if (!cssVal) return chain;
    classSet.add(ensureCssRule(property, cssVal));
    return chain;
  };

  chain.add = add;
  chain.w = (v) => add("w", v);
  chain.h = (v) => add("h", v);
  chain.bg = (v) => add("bg", v);
  chain.border = (v) => add("border", v);
  chain.borderRadius = (v) => add("borderRadius", v);
  chain.classNames = () => Array.from(classSet).join(" ");
  chain.toString = () => chain.classNames();

  return chain;
}

// ---- Class name builder (Tailwind-like) ----

type CnArg = string | number | null | undefined | false | Record<string, any> | Array<any>;

const spacingScale: Record<string, string> = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
};

const roundedScale: Record<string, string> = {
  none: "0px",
  sm: "0.125rem",
  "": "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
};

const fontWeightMap: Record<string, string> = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

const displayMap: Record<string, string> = {
  block: "block",
  inline: "inline",
  "inline-block": "inline-block",
  flex: "flex",
  grid: "grid",
  hidden: "none",
};

function isNumeric(v: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(v);
}

function decodeBracketValue(v: string): string {
  // Replace underscores with spaces to allow tokens like [2px_solid_black]
  return v.replace(/_/g, " ");
}

function pushRule(classes: string[], property: string, value: string) {
  classes.push(ensureCssRule(property, value));
}

function resolveSpacing(value: string): string {
  if (value in spacingScale) return spacingScale[value];
  if (isNumeric(value)) return `${value}px`;
  return value;
}

function applySpacing(classes: string[], base: "padding" | "margin", dir: string, raw: string) {
  const val = resolveSpacing(raw);
  switch (dir) {
    case "":
      pushRule(classes, base, val);
      break;
    case "x":
      pushRule(classes, `${base}-left`, val);
      pushRule(classes, `${base}-right`, val);
      break;
    case "y":
      pushRule(classes, `${base}-top`, val);
      pushRule(classes, `${base}-bottom`, val);
      break;
    case "t":
      pushRule(classes, `${base}-top`, val); break;
    case "r":
      pushRule(classes, `${base}-right`, val); break;
    case "b":
      pushRule(classes, `${base}-bottom`, val); break;
    case "l":
      pushRule(classes, `${base}-left`, val); break;
  }
}

function processToken(token: string, classes: string[]) {
  if (!token) return;

  // Arbitrary values: prefix-[value]
  const arbitrary = token.match(/^([a-z-]+)-\[(.+)\]$/i);
  if (arbitrary) {
    const prefix = arbitrary[1];
    const val = decodeBracketValue(arbitrary[2]);
    switch (prefix) {
      case "w": pushRule(classes, "width", val); return;
      case "h": pushRule(classes, "height", val); return;
      case "bg": pushRule(classes, "background-color", val); return;
      case "text": pushRule(classes, "color", val); return;
      case "border": pushRule(classes, "border", val); return;
      case "rounded":
        pushRule(classes, "border-radius", val); return;
      case "p": applySpacing(classes, "padding", "", val); return;
      case "px": applySpacing(classes, "padding", "x", val); return;
      case "py": applySpacing(classes, "padding", "y", val); return;
      case "pt": applySpacing(classes, "padding", "t", val); return;
      case "pr": applySpacing(classes, "padding", "r", val); return;
      case "pb": applySpacing(classes, "padding", "b", val); return;
      case "pl": applySpacing(classes, "padding", "l", val); return;
      case "m": applySpacing(classes, "margin", "", val); return;
      case "mx": applySpacing(classes, "margin", "x", val); return;
      case "my": applySpacing(classes, "margin", "y", val); return;
      case "mt": applySpacing(classes, "margin", "t", val); return;
      case "mr": applySpacing(classes, "margin", "r", val); return;
      case "mb": applySpacing(classes, "margin", "b", val); return;
      case "ml": applySpacing(classes, "margin", "l", val); return;
      case "gap": pushRule(classes, "gap", val); return;
      default:
        // Treat unknown prefix as raw class (user-managed)
        classes.push(token);
        return;
    }
  }

  // Spacing: p-*, px-*, py-*, pt/pr/pb/pl-*, m-*, mx/my/mt/mr/mb/ml-*
  const spacing = token.match(/^(p|m)(x|y|t|r|b|l)?-(.+)$/);
  if (spacing) {
    const base = spacing[1] === "p" ? "padding" : "margin";
    applySpacing(classes, base, spacing[2] ?? "", spacing[3]);
    return;
  }

  // Width / Height: w-*, h-*
  const size = token.match(/^(w|h)-(.+)$/);
  if (size) {
    const prop = size[1] === "w" ? "width" : "height";
    const raw = size[2];
    const val = isNumeric(raw) ? `${raw}px` : raw;
    pushRule(classes, prop, val);
    return;
  }

  // Background: bg-*
  const bgMatch = token.match(/^bg-(.+)$/);
  if (bgMatch) {
    const v = bgMatch[1];
    // Allow raw CSS color names or codes
    pushRule(classes, "background-color", v);
    return;
  }

  // Text color: text-<color> and text size: text-xs/sm/base/lg/xl/...
  const textMatch = token.match(/^text-([a-z0-9]+)$/i);
  if (textMatch) {
    const v = textMatch[1].toLowerCase();
    const sizeMap: Record<string, string> = {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    };
    if (v in sizeMap) {
      pushRule(classes, "font-size", sizeMap[v]);
    } else {
      pushRule(classes, "color", v);
    }
    return;
  }

  // Font weight: font-bold, font-semibold, font-light, etc
  const fw = token.match(/^font-([a-z]+)$/);
  if (fw) {
    const w = fontWeightMap[fw[1].toLowerCase()];
    if (w) pushRule(classes, "font-weight", w);
    else classes.push(token);
    return;
  }

  // Display: block, inline, inline-block, flex, grid, hidden
  if (token in displayMap) {
    pushRule(classes, "display", displayMap[token]);
    return;
  }

  // Align / justify
  if (token === "items-center") { pushRule(classes, "align-items", "center"); return; }
  if (token === "items-start") { pushRule(classes, "align-items", "flex-start"); return; }
  if (token === "items-end") { pushRule(classes, "align-items", "flex-end"); return; }
  if (token === "justify-center") { pushRule(classes, "justify-content", "center"); return; }
  if (token === "justify-between") { pushRule(classes, "justify-content", "space-between"); return; }
  if (token === "justify-around") { pushRule(classes, "justify-content", "space-around"); return; }
  if (token === "justify-end") { pushRule(classes, "justify-content", "flex-end"); return; }
  if (token.startsWith("gap-")) {
    const val = token.slice(4);
    pushRule(classes, "gap", resolveSpacing(val));
    return;
  }

  // Border
  if (token === "border") {
    pushRule(classes, "border-style", "solid");
    pushRule(classes, "border-width", "1px");
    return;
  }
  const borderWidth = token.match(/^border-(0|2|4|8)$/);
  if (borderWidth) {
    pushRule(classes, "border-style", "solid");
    const w = borderWidth[1] === "0" ? "0" : `${borderWidth[1]}px`;
    pushRule(classes, "border-width", w);
    return;
  }
  const rounded = token.match(/^rounded(?:-([a-z0-9]+))?$/);
  if (rounded) {
    const key = (rounded[1] ?? "").toLowerCase();
    const val = key in roundedScale ? roundedScale[key] : roundedScale[""];
    pushRule(classes, "border-radius", val);
    return;
  }

  // Fallback: treat as user-managed class
  classes.push(token);
}

function flattenCnArgs(args: CnArg[]): string[] {
  const out: string[] = [];
  const visit = (v: any) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      const s = String(v).trim();
      if (!s) return;
      // Split by whitespace to allow "px-4 py-2"
      s.split(/\s+/).forEach((t) => out.push(t));
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(visit);
      return;
    }
    if (typeof v === "object") {
      for (const k of Object.keys(v)) {
        if (v[k]) out.push(k);
      }
      return;
    }
  };
  args.forEach(visit);
  return out;
}

function buildCnClasses(args: CnArg[]): string[] {
  const classes: string[] = [];
  const tokens = flattenCnArgs(args);
  for (const t of tokens) {
    processToken(t, classes);
  }
  return Array.from(new Set(classes));
}

/**
 * cn(...args) builds Tailwind-like classes (with arbitrary values support) and applies them.
 * Accepts strings, numbers, arrays, and object conditionals similarly to classnames/clsx.
 * Examples:
 *  - cn("w-[100px]", "h-[200px]", "bg-blue")
 *  - cn(["px-4", "py-2", { "rounded": isActive }])
 */
export function cn(...args: CnArg[]): NodeModFn<any> {
  // Support cn([ ... ]) as well as cn(a,b,c)
  const normalized = args.length === 1 && Array.isArray(args[0]) ? (args[0] as any[]) : args;
  const classes = buildCnClasses(normalized);
  return (parent: ExpandedElement<any>) => {
    if (!parent || classes.length === 0) return;
    try {
      if ((parent as any).classList && typeof (parent as any).classList.add === "function") {
        (parent as any).classList.add(...classes);
      } else {
        const existing = ((parent as any).className ?? "").toString().trim();
        const merged = (existing ? existing.split(/\s+/) : []).concat(classes);
        const unique = Array.from(new Set(merged)).join(" ").trim();
        (parent as any).className = unique;
      }
    } catch {
      // ignore
    }
  };
}

// ---- Public API (exports) ----

/**
 * Width utility.
 * Example: w("100px"), w(100) -> "100px"
 */
export function w(value: CSSValue): StyleChain {
  return createChain().w(value);
}

/**
 * Height utility.
 * Example: h("200px"), h(200) -> "200px"
 */
export function h(value: CSSValue): StyleChain {
  return createChain().h(value);
}

/**
 * Background color utility.
 * Example: bg("blue"), bg("#00f"), bg("rgb(0,0,255)")
 */
export function bg(value: CSSValue): StyleChain {
  return createChain().bg(value);
}

/**
 * Border utility.
 * Example: border("2px solid black")
 */
export function border(value: CSSValue): StyleChain {
  return createChain().border(value);
}

/**
 * Border radius utility.
 * Example: borderRadius("5px"), borderRadius(5) -> "5px"
 */
export function borderRadius(value: CSSValue): StyleChain {
  return createChain().borderRadius(value);
}

/**
 * Generic utility for arbitrary CSS properties (advanced use).
 * Example: css("padding", "8px").bg("red")
 */
export function css(property: string, value: CSSValue): StyleChain {
  const chain = createChain();
  return chain.add(property, value);
}

// ---- Global registration (mods available globally) ----
export function registerGlobalStyleUtilities(target: Record<string, unknown> = globalThis): void {
  const marker = "__vc_style_registered";
  const t = target as any;
  if (t[marker]) return;

  if (!t.w) t.w = w;
  if (!t.h) t.h = h;
  if (!t.bg) t.bg = bg;
  if (!t.border) t.border = border;
  if (!t.borderRadius) t.borderRadius = borderRadius;
  if (!t.css) t.css = css;
  if (!t.cn) t.cn = cn;

  t[marker] = true;
}



// Attach to globalThis so they can be used directly (e.g., w("100px").h("200px")...).
if (typeof globalThis !== "undefined") {
  registerGlobalStyleUtilities(globalThis as unknown as Record<string, unknown>);
}