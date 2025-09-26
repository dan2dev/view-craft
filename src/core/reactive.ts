import { logError, safeExecute } from "../utility/errorHandler";
import { isNodeConnected } from "../utility/dom";
import { createText } from "../utility/nodeFactory";

type TextResolver = () => Primitive;
type AttributeResolver = () => unknown;

interface ReactiveTextNodeInfo {
  resolver: TextResolver;
  lastValue: string;
}

interface ReactiveElementInfo {
  attributeResolvers: Map<string, {
    resolver: AttributeResolver;
    applyValue: (value: unknown) => void;
  }>;
  updateListener?: EventListener;
}

const reactiveTextNodes = new Map<Text, ReactiveTextNodeInfo>();
const reactiveElements = new Map<Element, ReactiveElementInfo>();

function ensureElementInfo(el: Element): ReactiveElementInfo {
  let info = reactiveElements.get(el);
  if (!info) {
    info = { attributeResolvers: new Map() };
    reactiveElements.set(el, info);
  }
  return info;
}

function applyAttributeResolvers(el: Element, info: ReactiveElementInfo): void {
  info.attributeResolvers.forEach((r, key) => {
    try {
      r.applyValue(safeExecute(r.resolver));
    } catch (e) {
      logError(`Failed to update reactive attribute: ${key}`, e);
    }
  });
}

export function createReactiveTextNode(
  resolver: TextResolver, 
  preEvaluated?: unknown, 
  existingNode?: Text
): Text {
  // Use existing node during hydration if provided
  const txt = existingNode || (createText("") as Text);
  
  if (typeof resolver !== "function") {
    logError("Invalid resolver provided to createReactiveTextNode");
    return txt;
  }
  
  const initial = arguments.length > 1 ? preEvaluated : safeExecute(resolver, "");
  const str = initial === undefined ? "" : String(initial);
  
  // Only update text content if it differs (preserve SSR content when possible)
  if (txt.textContent !== str) {
    txt.textContent = str;
  }
  
  reactiveTextNodes.set(txt, { resolver, lastValue: str });
  return txt;
}

export function registerAttributeResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: string,
  resolver: AttributeResolver,
  applyValue: (value: unknown) => void
): void {
  if (!(element instanceof Element) || !key || typeof resolver !== "function") {
    logError("Invalid parameters for registerAttributeResolver");
    return;
  }
  const info = ensureElementInfo(element as Element);
  info.attributeResolvers.set(key, { resolver, applyValue });

  try {
    applyValue(safeExecute(resolver));
  } catch (e) {
    logError("Failed to apply initial attribute value", e);
  }

  if (!info.updateListener) {
    const listener: EventListener = () => applyAttributeResolvers(element as Element, info);
    (element as Element).addEventListener("update", listener);
    info.updateListener = listener;
  }
}

export function notifyReactiveTextNodes(): void {
  reactiveTextNodes.forEach((info, node) => {
    if (!isNodeConnected(node)) {
      reactiveTextNodes.delete(node);
      return;
    }
    try {
      const raw = safeExecute(info.resolver);
      const newVal = raw === undefined ? "" : String(raw);
      if (newVal !== info.lastValue) {
        node.textContent = newVal;
        info.lastValue = newVal;
      }
    } catch (e) {
      logError("Failed to update reactive text node", e);
    }
  });
}

export function notifyReactiveElements(): void {
  reactiveElements.forEach((info, el) => {
    if (!isNodeConnected(el)) {
      if (info.updateListener) el.removeEventListener("update", info.updateListener);
      reactiveElements.delete(el);
      return;
    }
    applyAttributeResolvers(el, info);
  });
}
