import { logError, safeExecute } from "../utility/errorHandler";
import { isNodeConnected } from "../utility/dom";

type TextResolver = () => Primitive;
type AttributeResolver = () => unknown;
type NodeModFnResolver<TTagName extends ElementTagName = ElementTagName> = () => NodeModFn<TTagName>;

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

interface ReactiveNodeModFnInfo<TTagName extends ElementTagName = ElementTagName> {
  resolver: NodeModFnResolver<TTagName>;
  parent: ExpandedElement<TTagName>;
  index: number;
  lastModFn?: NodeModFn<TTagName>;
}

const reactiveTextNodes = new Map<Text, ReactiveTextNodeInfo>();
const reactiveElements = new Map<Element, ReactiveElementInfo>();
const reactiveNodeModFns = new Map<Element, ReactiveNodeModFnInfo[]>();

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

export function createReactiveTextNode(resolver: TextResolver, preEvaluated?: unknown): Text {
  const txt = document.createTextNode("");
  if (typeof resolver !== "function") {
    logError("Invalid resolver provided to createReactiveTextNode");
    return txt;
  }
  const initial = arguments.length > 1 ? preEvaluated : safeExecute(resolver, "");
  const str = initial === undefined ? "" : String(initial);
  txt.textContent = str;
  reactiveTextNodes.set(txt, { resolver, lastValue: str });
  return txt;
}

export function createReactiveNodeModFn<TTagName extends ElementTagName>(
  resolver: NodeModFnResolver<TTagName>,
  parent: ExpandedElement<TTagName>,
  index: number
): Node | null {
  if (typeof resolver !== "function") {
    logError("Invalid resolver provided to createReactiveNodeModFn");
    return null;
  }

  try {
    // Execute the resolver to get the NodeModFn
    const nodeModFn = safeExecute(resolver);
    if (typeof nodeModFn !== "function") {
      logError("Resolver did not return a function");
      return null;
    }

    // Execute the NodeModFn initially (e.g., cn() applies styles to parent)
    nodeModFn(parent, index);
    
    // Store reactive info for updates
    const info: ReactiveNodeModFnInfo<TTagName> = {
      resolver,
      parent,
      index,
      lastModFn: nodeModFn
    };

    const parentElement = parent as Element;
    const existing = reactiveNodeModFns.get(parentElement) || [];
    existing.push(info);
    reactiveNodeModFns.set(parentElement, existing);

    // Return null since NodeModFn like cn() doesn't produce a new node
    return null;
  } catch (error) {
    logError("Failed to create reactive NodeModFn", error);
    return null;
  }
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

export function notifyReactiveNodeModFns(): void {
  reactiveNodeModFns.forEach((infos, el) => {
    if (!isNodeConnected(el)) {
      reactiveNodeModFns.delete(el);
      return;
    }

    infos.forEach((info) => {
      try {
        // Re-evaluate the resolver to get the NodeModFn (may be same function but with different closure state)
        const nodeModFn = safeExecute(info.resolver);
        if (typeof nodeModFn === "function") {
          // Always execute the NodeModFn since reactive state may have changed
          // For cn(), this will re-evaluate the classes and update the DOM
          nodeModFn(info.parent, info.index);
          info.lastModFn = nodeModFn;
        }
      } catch (error) {
        logError("Failed to update reactive NodeModFn", error);
      }
    });
  });
}
