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
 * - Utilities generate deterministic class names (property + value, no hashes) and insert rules via CSSStyleSheet.insertRule.
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

function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/%/g, "pct")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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

  // Handle pseudo-classes (hover, focus, etc.)
  const isPseudo = property.includes(':');
  const baseProp = isPseudo ? property.split(':')[0] : property;
  const pseudoClass = isPseudo ? property.split(':')[1] : '';

  const propSlug = propAbbrev(baseProp);
  const valueSlug = slugify(value);
  const pseudoPrefix = pseudoClass ? `${pseudoClass}-` : '';
  const cls = `${CLASS_PREFIX}-${pseudoPrefix}${propSlug}-${valueSlug}`;
  const sheet = getOrCreateStyleSheet();

  // Insert the rule if possible (browser); on SSR we just cache the class for later use.
  if (sheet) {
    const selector = isPseudo ? `.${cls}:${pseudoClass}` : `.${cls}`;
    const rule = `${selector} { ${baseProp}: ${value}; }`;
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

const scales = {
  spacing: { "0": "0px", px: "1px", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem", "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "3.5": "0.875rem", "4": "1rem", "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem", "16": "4rem", "20": "5rem" } as Record<string, string>,
  rounded: { none: "0px", sm: "0.125rem", "": "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", full: "9999px" } as Record<string, string>,
  fontWeight: { thin: "100", extralight: "200", light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800", black: "900" } as Record<string, string>
};

const colors = {
  gray: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827"],
  red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"],
  blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"],
  indigo: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"]
};

function resolveColor(colorName: string): string {
  if (["white", "black", "transparent"].includes(colorName)) return colorName;
  
  const match = colorName.match(/^([a-z]+)-?(\d+)?$/);
  if (match) {
    const [, color, shade] = match;
    const arr = colors[color as keyof typeof colors];
    if (arr) {
      const idx = shade ? Math.floor(parseInt(shade) / 100) - 1 : 4; // default to 500 (index 5)
      return arr[Math.max(0, Math.min(idx, arr.length - 1))] || colorName;
    }
  }
  return colorName;
}



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
  return scales.spacing[value] || (isNumeric(value) ? `${value}px` : value);
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

function getPropertyForToken(token: string): string | null {
  // Background color
  if (token.startsWith('bg-')) {
    const colorPart = token.slice(3);
    if (!colorPart.startsWith('gradient-')) {
      return 'background-color';
    }
  }

  // Text color
  if (token.startsWith('text-')) {
    const colorPart = token.slice(5);
    const sizeMap = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
    if (!sizeMap.includes(colorPart)) {
      return 'color';
    }
  }

  // Border
  if (token.startsWith('border-') && !token.match(/^border-[0-9]/)) {
    return 'border-color';
  }

  // Outline
  if (token === 'outline-none') {
    return 'outline';
  }

  // Ring (focus ring)
  if (token.startsWith('ring-')) {
    return 'box-shadow';
  }

  return null;
}

function getValueForToken(token: string): string | null {
  // Background color
  if (token.startsWith('bg-')) {
    const colorPart = token.slice(3);
    if (!colorPart.startsWith('gradient-')) {
      return resolveColor(colorPart);
    }
  }

  // Text color
  if (token.startsWith('text-')) {
    const colorPart = token.slice(5);
    const sizeMap = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
    if (!sizeMap.includes(colorPart)) {
      return resolveColor(colorPart);
    }
  }

  // Border color
  if (token.startsWith('border-') && !token.match(/^border-[0-9]/)) {
    const colorPart = token.slice(7);
    return resolveColor(colorPart);
  }

  // Outline
  if (token === 'outline-none') {
    return 'none';
  }

  // Ring (focus ring)
  if (token.startsWith('ring-')) {
    const ringPart = token.slice(5);
    if (ringPart === '2') {
      return '0 0 0 2px rgba(59, 130, 246, 0.5)';
    } else {
      const color = resolveColor(ringPart);
      return `0 0 0 2px ${color}`;
    }
  }

  return null;
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

    // Handle gradient backgrounds
    if (v.startsWith("gradient-")) {
      if (v === "gradient-to-r") {
        pushRule(classes, "background-image", "linear-gradient(to right, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-br") {
        pushRule(classes, "background-image", "linear-gradient(to bottom right, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-b") {
        pushRule(classes, "background-image", "linear-gradient(to bottom, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-l") {
        pushRule(classes, "background-image", "linear-gradient(to left, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-t") {
        pushRule(classes, "background-image", "linear-gradient(to top, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-bl") {
        pushRule(classes, "background-image", "linear-gradient(to bottom left, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-tr") {
        pushRule(classes, "background-image", "linear-gradient(to top right, var(--tw-gradient-stops))");
        return;
      }
      if (v === "gradient-to-tl") {
        pushRule(classes, "background-image", "linear-gradient(to top left, var(--tw-gradient-stops))");
        return;
      }
    }

    // Regular background color
    const color = resolveColor(v);
    pushRule(classes, "background-color", color);
    return;
  }

  // Text color: text-<color> and text size: text-xs/sm/base/lg/xl/...
  const textMatch = token.match(/^text-(.+)$/i);
  if (textMatch) {
    const v = textMatch[1];
    const sizes: Record<string, string> = { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem" };
    pushRule(classes, sizes[v] ? "font-size" : "color", sizes[v] || resolveColor(v));
    return;
  }

  // Gradient color stops: from-* and to-*
  const fromMatch = token.match(/^from-(.+)$/);
  if (fromMatch) {
    const color = resolveColor(fromMatch[1]);
    pushRule(classes, "--tw-gradient-from", color);
    pushRule(classes, "--tw-gradient-to", "rgb(255 255 255 / 0)");
    pushRule(classes, "--tw-gradient-stops", "var(--tw-gradient-from), var(--tw-gradient-to)");
    return;
  }

  const toMatch = token.match(/^to-(.+)$/);
  if (toMatch) {
    const color = resolveColor(toMatch[1]);
    pushRule(classes, "--tw-gradient-to", color);
    return;
  }

  // Font weight: font-bold, font-semibold, font-light, etc
  const fw = token.match(/^font-([a-z]+)$/);
  if (fw) {
    const w = scales.fontWeight[fw[1].toLowerCase()];
    if (w) pushRule(classes, "font-weight", w);
    else classes.push(token);
    return;
  }

  // Display
  const displays: Record<string, string> = { block: "block", inline: "inline", "inline-block": "inline-block", flex: "flex", grid: "grid", hidden: "none" };
  if (displays[token]) { pushRule(classes, "display", displays[token]); return; }

  // Flexbox alignment
  const alignMap: Record<string, [string, string]> = { "items-center": ["align-items", "center"], "items-start": ["align-items", "flex-start"], "items-end": ["align-items", "flex-end"], "justify-center": ["justify-content", "center"], "justify-between": ["justify-content", "space-between"], "justify-around": ["justify-content", "space-around"], "justify-end": ["justify-content", "flex-end"] };
  if (alignMap[token]) { pushRule(classes, alignMap[token][0], alignMap[token][1]); return; }
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
  if (token === "border-b") {
    pushRule(classes, "border-bottom-style", "solid");
    pushRule(classes, "border-bottom-width", "1px");
    return;
  }
  if (token === "border-transparent") {
    pushRule(classes, "border-color", "transparent");
    return;
  }
  const borderWidth = token.match(/^border-(0|2|4|8)$/);
  if (borderWidth) {
    pushRule(classes, "border-style", "solid");
    const w = borderWidth[1] === "0" ? "0" : `${borderWidth[1]}px`;
    pushRule(classes, "border-width", w);
    return;
  }
  const borderColor = token.match(/^border-(.+)$/);
  if (borderColor && !borderColor[1].match(/^[0-9]/)) {
    const color = resolveColor(borderColor[1]);
    pushRule(classes, "border-color", color);
    return;
  }
  const rounded = token.match(/^rounded(?:-([a-z0-9]+))?$/);
  if (rounded) {
    const key = rounded[1] || "";
    pushRule(classes, "border-radius", scales.rounded[key] || scales.rounded[""]);
    return;
  }

  // Hover states: hover:*
  const hoverMatch = token.match(/^hover:(.+)$/);
  if (hoverMatch) {
    const innerToken = hoverMatch[1];
    const property = getPropertyForToken(innerToken);
    const value = getValueForToken(innerToken);

    if (property && value) {
      const cls = ensureCssRule(`${property}:hover`, value);
      classes.push(cls);
    }
    return;
  }

  // Focus states: focus:*
  const focusMatch = token.match(/^focus:(.+)$/);
  if (focusMatch) {
    const innerToken = focusMatch[1];
    const property = getPropertyForToken(innerToken);
    const value = getValueForToken(innerToken);

    if (property && value) {
      const cls = ensureCssRule(`${property}:focus`, value);
      classes.push(cls);
    }
    return;
  }

  // Additional utilities
  if (token === "transition-colors") {
    pushRule(classes, "transition-property", "color, background-color, border-color, text-decoration-color, fill, stroke");
    pushRule(classes, "transition-timing-function", "cubic-bezier(0.4, 0, 0.2, 1)");
    pushRule(classes, "transition-duration", "150ms");
    return;
  }
  if (token === "transition-all") {
    pushRule(classes, "transition-property", "all");
    pushRule(classes, "transition-timing-function", "cubic-bezier(0.4, 0, 0.2, 1)");
    pushRule(classes, "transition-duration", "150ms");
    return;
  }
  if (token === "cursor-not-allowed") {
    pushRule(classes, "cursor", "not-allowed");
    return;
  }
  if (token === "line-through") {
    pushRule(classes, "text-decoration-line", "line-through");
    return;
  }
  if (token === "text-center") {
    pushRule(classes, "text-align", "center");
    return;
  }
  if (token === "overflow-hidden") {
    pushRule(classes, "overflow", "hidden");
    return;
  }
  if (token === "shadow-lg") {
    pushRule(classes, "box-shadow", "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)");
    return;
  }
  if (token === "space-y-2") {
    pushRule(classes, "--tw-space-y-reverse", "0");
    pushRule(classes, "margin-top", "calc(0.5rem * calc(1 - var(--tw-space-y-reverse)))");
    pushRule(classes, "margin-bottom", "calc(0.5rem * var(--tw-space-y-reverse))");
    return;
  }
  if (token.startsWith("max-w-")) {
    const size = token.slice(7);
    const sizeMap: Record<string, string> = {
      "2xl": "42rem",
      xl: "36rem",
      lg: "32rem",
      md: "28rem",
      sm: "24rem",
    };
    const val = sizeMap[size] || size;
    pushRule(classes, "max-width", val);
    return;
  }
  if (token.startsWith("min-h-")) {
    const size = token.slice(7);
    const val = size === "screen" ? "100vh" : size;
    pushRule(classes, "min-height", val);
    return;
  }
  if (token === "mx-auto") {
    pushRule(classes, "margin-left", "auto");
    pushRule(classes, "margin-right", "auto");
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
 * Accepts strings, numbers, arrays, functions, and object conditionals similarly to classnames/clsx.
 *
 * For dynamic styling, pass functions that return class arguments:
 *  - cn(() => isActive ? "bg-blue" : "bg-gray")
 *  - cn("w-[100px]", () => ({ "rounded": isRounded }))
 *
 * Static examples:
 *  - cn("w-[100px]", "h-[200px]", "bg-blue")
 *  - cn(["px-4", "py-2", { "rounded": isActive }])
 */
export function cn(...args: (CnArg | (() => CnArg) | (() => CnArg[]))[]): NodeModFn<any> {
  // Check if any argument is a function (dynamic)
  const hasFunctions = args.some(arg => typeof arg === "function");

  if (!hasFunctions) {
    // Static case - compute classes once
    const normalized = args.length === 1 && Array.isArray(args[0]) ? (args[0] as any[]) : args;
    const classes = buildCnClasses(normalized as CnArg[]);
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

  // Dynamic case - create a reactive className updater
  let lastClasses: string[] = [];

  return (parent: ExpandedElement<any>) => {
    if (!parent) return;

    try {
      // Evaluate functions and resolve all arguments
      const resolvedArgs: CnArg[] = [];
      for (const arg of args) {
        if (typeof arg === "function") {
          try {
            const result = (arg as () => CnArg | CnArg[])();
            if (Array.isArray(result)) {
              resolvedArgs.push(...result);
            } else {
              resolvedArgs.push(result);
            }
          } catch (error) {
            // Ignore function evaluation errors
            continue;
          }
        } else {
          resolvedArgs.push(arg as CnArg);
        }
      }

      const newClasses = buildCnClasses(resolvedArgs);

      // Only update if classes changed
      if (JSON.stringify(newClasses) !== JSON.stringify(lastClasses)) {
        // Remove old classes
        if (lastClasses.length > 0 && (parent as any).classList?.remove) {
          (parent as any).classList.remove(...lastClasses);
        }

        // Add new classes
        if (newClasses.length > 0) {
          if ((parent as any).classList?.add) {
            (parent as any).classList.add(...newClasses);
          } else {
            // Fallback without classList
            const existing = ((parent as any).className ?? "").toString().trim();
            const existingClasses = existing ? existing.split(/\s+/) : [];
            const filteredExisting = existingClasses.filter((cls: string) => !lastClasses.includes(cls));
            const unique = Array.from(new Set([...filteredExisting, ...newClasses])).join(" ").trim();
            (parent as any).className = unique;
          }
        }

        lastClasses = newClasses;
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
export const w = (value: CSSValue): StyleChain => createChain().w(value);


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
