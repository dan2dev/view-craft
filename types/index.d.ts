import type { Primitive as TypeFestPrimitive } from "type-fest";

declare global {
  export type Primitive = TypeFestPrimitive;
  export type ElementTagName = keyof HTMLElementTagNameMap;

  // Expanded element types (with mods)
  export type ExpandedElementAttributes<TTagName extends ElementTagName = ElementTagName> = {
    [K in keyof HTMLElementTagNameMap[TTagName]]?:
      | HTMLElementTagNameMap[TTagName][K]
      | (() => HTMLElementTagNameMap[TTagName][K]);
  };
  export type ExpandedElement<TTagName extends ElementTagName = ElementTagName> = Partial<
    Omit<HTMLElementTagNameMap[TTagName], "tagName">
  > &
    Pick<HTMLElementTagNameMap[TTagName], "tagName"> & {
      rawMods?: (NodeMod<TTagName> | NodeModFn<TTagName>[]);
      mods?: NodeMod<TTagName>[];
    };

  // Node modifier types
  export type NodeMod<TTagName extends ElementTagName = ElementTagName> =
    | Primitive
    | ExpandedElementAttributes<TTagName>
    | ExpandedElement<TTagName>;
  export type NodeModFn<TTagName extends ElementTagName = ElementTagName> = (
    parent: ExpandedElement<TTagName>,
    index: number,
  ) => NodeMod<TTagName> | void;

  // Node tags builder type
  export type ExpandedElementBuilder<TTagName extends ElementTagName = ElementTagName> = (
    ...rawMods: (NodeMod<TTagName> | NodeModFn<TTagName>)[]
  ) => (parent?: ExpandedElement<TTagName>, index?: number) => ExpandedElement<TTagName>;

  // Self-closing tag builder type
  export type SelfClosingElementBuilder<TTagName extends ElementTagName = ElementTagName> = (
      ...rawMods: (NodeModFn<TTagName>)[]
  ) => (parent?: ExpandedElement<TTagName>, index?: number) => ExpandedElement<TTagName>;

  // SVG node tags builder type
  export type ExpandedSVGElementBuilder<TTagName extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap> = (
    ...rawMods: any[]
  ) => (parent?: SVGElementTagNameMap[TTagName], index?: number) => SVGElementTagNameMap[TTagName];

  // tags from tags.ts
  export const a: ExpandedElementBuilder<"a">;
  export const abbr: ExpandedElementBuilder<"abbr">;
  export const address: ExpandedElementBuilder<"address">;
  // ---- Self-closing HTML tags (cannot have children) ----
  export const area: SelfClosingElementBuilder<"area">;
  export const article: ExpandedElementBuilder<"article">;
  export const aside: ExpandedElementBuilder<"aside">;
  export const audio: ExpandedElementBuilder<"audio">;
  export const b: ExpandedElementBuilder<"b">;
  export const base: SelfClosingElementBuilder<"base">;
  export const bdi: ExpandedElementBuilder<"bdi">;
  export const bdo: ExpandedElementBuilder<"bdo">;
  export const blockquote: ExpandedElementBuilder<"blockquote">;
  export const body: ExpandedElementBuilder<"body">;
  export const br: SelfClosingElementBuilder<"br">;
  export const button: ExpandedElementBuilder<"button">;
  export const canvas: ExpandedElementBuilder<"canvas">;
  export const caption: ExpandedElementBuilder<"caption">;
  export const cite: ExpandedElementBuilder<"cite">;
  export const code: ExpandedElementBuilder<"code">;
  export const col: SelfClosingElementBuilder<"col">;
  export const colgroup: ExpandedElementBuilder<"colgroup">;
  export const data: ExpandedElementBuilder<"data">;
  export const datalist: ExpandedElementBuilder<"datalist">;
  export const dd: ExpandedElementBuilder<"dd">;
  export const del: ExpandedElementBuilder<"del">;
  export const details: ExpandedElementBuilder<"details">;
  export const dfn: ExpandedElementBuilder<"dfn">;
  export const dialog: ExpandedElementBuilder<"dialog">;
  export const div: ExpandedElementBuilder<"div">;
  export const dl: ExpandedElementBuilder<"dl">;
  export const dt: ExpandedElementBuilder<"dt">;
  export const em: ExpandedElementBuilder<"em">;
  export const embed: SelfClosingElementBuilder<"embed">;
  export const fieldset: ExpandedElementBuilder<"fieldset">;
  export const figcaption: ExpandedElementBuilder<"figcaption">;
  export const figure: ExpandedElementBuilder<"figure">;
  export const footer: ExpandedElementBuilder<"footer">;
  export const form: ExpandedElementBuilder<"form">;
  export const h1: ExpandedElementBuilder<"h1">;
  export const h2: ExpandedElementBuilder<"h2">;
  export const h3: ExpandedElementBuilder<"h3">;
  export const h4: ExpandedElementBuilder<"h4">;
  export const h5: ExpandedElementBuilder<"h5">;
  export const h6: ExpandedElementBuilder<"h6">;
  export const head: ExpandedElementBuilder<"head">;
  export const header: ExpandedElementBuilder<"header">;
  export const hgroup: ExpandedElementBuilder<"hgroup">;
  export const hr: SelfClosingElementBuilder<"hr">;
  export const html: ExpandedElementBuilder<"html">;
  export const i: ExpandedElementBuilder<"i">;
  export const iframe: ExpandedElementBuilder<"iframe">;
  export const img: SelfClosingElementBuilder<"img">;
  export const input: SelfClosingElementBuilder<"input">;
  export const ins: ExpandedElementBuilder<"ins">;
  export const kbd: ExpandedElementBuilder<"kbd">;
  export const label: ExpandedElementBuilder<"label">;
  export const legend: ExpandedElementBuilder<"legend">;
  export const li: ExpandedElementBuilder<"li">;
  export const link: SelfClosingElementBuilder<"link">;
  export const main: ExpandedElementBuilder<"main">;
  export const map: ExpandedElementBuilder<"map">;
  export const mark: ExpandedElementBuilder<"mark">;
  export const menu: ExpandedElementBuilder<"menu">;
  export const meta: SelfClosingElementBuilder<"meta">;
  export const meter: ExpandedElementBuilder<"meter">;
  export const nav: ExpandedElementBuilder<"nav">;
  export const noscript: ExpandedElementBuilder<"noscript">;
  export const object: ExpandedElementBuilder<"object">;
  export const ol: ExpandedElementBuilder<"ol">;
  export const optgroup: ExpandedElementBuilder<"optgroup">;
  export const option: ExpandedElementBuilder<"option">;
  export const output: ExpandedElementBuilder<"output">;
  export const p: ExpandedElementBuilder<"p">;
  export const picture: ExpandedElementBuilder<"picture">;
  export const pre: ExpandedElementBuilder<"pre">;
  export const progress: ExpandedElementBuilder<"progress">;
  export const q: ExpandedElementBuilder<"q">;
  export const rp: ExpandedElementBuilder<"rp">;
  export const rt: ExpandedElementBuilder<"rt">;
  export const ruby: ExpandedElementBuilder<"ruby">;
  export const s: ExpandedElementBuilder<"s">;
  export const samp: ExpandedElementBuilder<"samp">;
  export const script: ExpandedElementBuilder<"script">;
  export const search: ExpandedElementBuilder<"search">;
  export const section: ExpandedElementBuilder<"section">;
  export const select: ExpandedElementBuilder<"select">;
  export const slot: ExpandedElementBuilder<"slot">;
  export const small: ExpandedElementBuilder<"small">;
  export const source: SelfClosingElementBuilder<"source">;
  export const span: ExpandedElementBuilder<"span">;
  export const strong: ExpandedElementBuilder<"strong">;
  export const style: ExpandedElementBuilder<"style">;
  export const sub: ExpandedElementBuilder<"sub">;
  export const summary: ExpandedElementBuilder<"summary">;
  export const sup: ExpandedElementBuilder<"sup">;
  export const table: ExpandedElementBuilder<"table">;
  export const tbody: ExpandedElementBuilder<"tbody">;
  export const td: ExpandedElementBuilder<"td">;
  export const template: ExpandedElementBuilder<"template">;
  export const textarea: ExpandedElementBuilder<"textarea">;
  export const tfoot: ExpandedElementBuilder<"tfoot">;
  export const th: ExpandedElementBuilder<"th">;
  export const thead: ExpandedElementBuilder<"thead">;
  export const time: ExpandedElementBuilder<"time">;
  export const title: ExpandedElementBuilder<"title">;
  export const tr: ExpandedElementBuilder<"tr">;
  export const track: SelfClosingElementBuilder<"track">;
  export const u: ExpandedElementBuilder<"u">;
  export const ul: ExpandedElementBuilder<"ul">;
  export const var_: ExpandedElementBuilder<"var">;
  export const video: ExpandedElementBuilder<"video">;
  export const wbr: SelfClosingElementBuilder<"wbr">;

  // svg tags
  export const a_svg: ExpandedSVGElementBuilder<"a">;
  export const animate: ExpandedSVGElementBuilder<"animate">;
  export const animateMotion: ExpandedSVGElementBuilder<"animateMotion">;
  export const animateTransform: ExpandedSVGElementBuilder<"animateTransform">;
  export const circle: ExpandedSVGElementBuilder<"circle">;
  export const clipPath: ExpandedSVGElementBuilder<"clipPath">;
  export const defs: ExpandedSVGElementBuilder<"defs">;
  export const desc: ExpandedSVGElementBuilder<"desc">;
  export const ellipse: ExpandedSVGElementBuilder<"ellipse">;
  export const feBlend: ExpandedSVGElementBuilder<"feBlend">;
  export const feColorMatrix: ExpandedSVGElementBuilder<"feColorMatrix">;
  export const feComponentTransfer: ExpandedSVGElementBuilder<"feComponentTransfer">;
  export const feComposite: ExpandedSVGElementBuilder<"feComposite">;
  export const feConvolveMatrix: ExpandedSVGElementBuilder<"feConvolveMatrix">;
  export const feDiffuseLighting: ExpandedSVGElementBuilder<"feDiffuseLighting">;
  export const feDisplacementMap: ExpandedSVGElementBuilder<"feDisplacementMap">;
  export const feDistantLight: ExpandedSVGElementBuilder<"feDistantLight">;
  export const feDropShadow: ExpandedSVGElementBuilder<"feDropShadow">;
  export const feFlood: ExpandedSVGElementBuilder<"feFlood">;
  export const feFuncA: ExpandedSVGElementBuilder<"feFuncA">;
  export const feFuncB: ExpandedSVGElementBuilder<"feFuncB">;
  export const feFuncG: ExpandedSVGElementBuilder<"feFuncG">;
  export const feFuncR: ExpandedSVGElementBuilder<"feFuncR">;
  export const feGaussianBlur: ExpandedSVGElementBuilder<"feGaussianBlur">;
  export const feImage: ExpandedSVGElementBuilder<"feImage">;
  export const feMerge: ExpandedSVGElementBuilder<"feMerge">;
  export const feMergeNode: ExpandedSVGElementBuilder<"feMergeNode">;
  export const feMorphology: ExpandedSVGElementBuilder<"feMorphology">;
  export const feOffset: ExpandedSVGElementBuilder<"feOffset">;
  export const fePointLight: ExpandedSVGElementBuilder<"fePointLight">;
  export const feSpecularLighting: ExpandedSVGElementBuilder<"feSpecularLighting">;
  export const feSpotLight: ExpandedSVGElementBuilder<"feSpotLight">;
  export const feTile: ExpandedSVGElementBuilder<"feTile">;
  export const feTurbulence: ExpandedSVGElementBuilder<"feTurbulence">;
  export const filter: ExpandedSVGElementBuilder<"filter">;
  export const foreignObject: ExpandedSVGElementBuilder<"foreignObject">;
  export const g: ExpandedSVGElementBuilder<"g">;
  export const image: ExpandedSVGElementBuilder<"image">;
  export const line: ExpandedSVGElementBuilder<"line">;
  export const linearGradient: ExpandedSVGElementBuilder<"linearGradient">;
  export const marker: ExpandedSVGElementBuilder<"marker">;
  export const mask: ExpandedSVGElementBuilder<"mask">;
  export const metadata: ExpandedSVGElementBuilder<"metadata">;
  export const mpath: ExpandedSVGElementBuilder<"mpath">;
  export const path: ExpandedSVGElementBuilder<"path">;
  export const pattern: ExpandedSVGElementBuilder<"pattern">;
  export const polygon: ExpandedSVGElementBuilder<"polygon">;
  export const polyline: ExpandedSVGElementBuilder<"polyline">;
  export const radialGradient: ExpandedSVGElementBuilder<"radialGradient">;
  export const rect: ExpandedSVGElementBuilder<"rect">;
  export const script_svg: ExpandedSVGElementBuilder<"script">;
  export const set: ExpandedSVGElementBuilder<"set">;
  export const stop_: ExpandedSVGElementBuilder<"stop">;
  export const style_svg: ExpandedSVGElementBuilder<"style">;
  export const svg: ExpandedSVGElementBuilder<"svg">;
  export const switch_svg: ExpandedSVGElementBuilder<"switch">;
  export const symbol: ExpandedSVGElementBuilder<"symbol">;
  export const text: ExpandedSVGElementBuilder<"text">;
  export const textPath: ExpandedSVGElementBuilder<"textPath">;
  export const title_svg: ExpandedSVGElementBuilder<"title">;
  export const tspan: ExpandedSVGElementBuilder<"tspan">;
  export const use: ExpandedSVGElementBuilder<"use">;
  export const view: ExpandedSVGElementBuilder<"view">;
}

export {};
