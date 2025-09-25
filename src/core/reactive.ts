import { logError, safeExecute } from "../utility/errorHandler";
import { isNodeConnected } from "../utility/dom";

type TextResolver = () => Primitive;
type AttributeResolver = () => unknown;

interface ReactiveTextNodeInfo {
  resolver: TextResolver;
  lastValue?: string;
}

interface ReactiveElementInfo {
  attributeResolvers: Map<string, {
    resolver: AttributeResolver;
    applyValue: (value: unknown) => void;
  }>;
}

// Global reactive state - using regular Maps for iteration support
const reactiveTextNodes = new Map<Text, ReactiveTextNodeInfo>();
const reactiveElements = new Map<Element, ReactiveElementInfo>();

export function trackReactiveElement<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>
): void {
  if (!element || !(element instanceof Element)) {
    logError("Cannot track non-element for reactive updates");
    return;
  }

  if (!reactiveElements.has(element)) {
    reactiveElements.set(element, {
      attributeResolvers: new Map()
    });
  }
}

export function createReactiveTextNode(resolver: TextResolver): Text {
  const textNode = document.createTextNode("");
  
  if (!resolver || typeof resolver !== "function") {
    logError("Invalid resolver provided to createReactiveTextNode");
    return textNode;
  }

  const nodeInfo: ReactiveTextNodeInfo = {
    resolver
  };

  reactiveTextNodes.set(textNode, nodeInfo);
  
  const initialValue = safeExecute(resolver, "");
  textNode.textContent = String(initialValue ?? "");
  nodeInfo.lastValue = String(initialValue ?? "");
  
  return textNode;
}

export function registerAttributeResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attributeKey: string,
  resolver: AttributeResolver,
  applyValue: (value: unknown) => void
): void {
  if (!element || !attributeKey || !resolver) {
    logError("Invalid parameters for registerAttributeResolver");
    return;
  }

  trackReactiveElement(element);
  const elementInfo = reactiveElements.get(element as Element);
  
  if (elementInfo) {
    elementInfo.attributeResolvers.set(attributeKey, {
      resolver,
      applyValue
    });

    // Apply initial value
    const initialValue = safeExecute(resolver);
    try {
      applyValue(initialValue);
    } catch (error) {
      logError("Failed to apply initial attribute value", error);
    }
  }
}

export function notifyReactiveTextNodes(): void {
  const disconnectedNodes: Text[] = [];
  
  reactiveTextNodes.forEach((nodeInfo, textNode) => {
    try {
      if (!isNodeConnected(textNode)) {
        disconnectedNodes.push(textNode);
        return;
      }

      const newValue = safeExecute(nodeInfo.resolver, "");
      const newValueStr = newValue == null ? String(newValue) : String(newValue);
      
      if (nodeInfo.lastValue !== newValueStr) {
        textNode.textContent = newValueStr;
        nodeInfo.lastValue = newValueStr;
      }
    } catch (error) {
      logError("Failed to update reactive text node", error);
    }
  });

  // Clean up disconnected nodes
  disconnectedNodes.forEach(node => {
    reactiveTextNodes.delete(node);
  });
}

export function notifyReactiveElements(): void {
  const disconnectedElements: Element[] = [];
  
  reactiveElements.forEach((elementInfo, element) => {
    try {
      if (!isNodeConnected(element)) {
        disconnectedElements.push(element);
        return;
      }

      elementInfo.attributeResolvers.forEach((resolverInfo, attributeKey) => {
        try {
          const newValue = safeExecute(resolverInfo.resolver);
          resolverInfo.applyValue(newValue);
        } catch (error) {
          logError(`Failed to update reactive attribute: ${attributeKey}`, error);
        }
      });
    } catch (error) {
      logError("Failed to update reactive element", error);
    }
  });

  // Clean up disconnected elements
  disconnectedElements.forEach(element => {
    reactiveElements.delete(element);
  });
}

export function clearReactiveState(): void {
  reactiveTextNodes.clear();
  reactiveElements.clear();
  logError("Reactive state cleared");
}