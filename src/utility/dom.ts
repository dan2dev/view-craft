import { isBrowser } from "./environment";

/**
 * Consolidated DOM utilities - simplified for better performance and smaller bundle size
 */

// Basic DOM operations with minimal error handling
export function safeAppendChild(parent: Element | Node, child: Node): boolean {
  if (!parent || !child) return false;
  try {
    parent.appendChild(child);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveChild(child: Node): boolean {
  if (!child?.parentNode) return false;
  try {
    child.parentNode.removeChild(child);
    return true;
  } catch {
    return false;
  }
}

export function safeInsertBefore(parent: Node, newNode: Node, referenceNode: Node | null): boolean {
  if (!parent || !newNode) return false;
  try {
    parent.insertBefore(newNode, referenceNode);
    return true;
  } catch {
    return false;
  }
}

export function safeReplaceChild(parent: Node, newChild: Node, oldChild: Node): boolean {
  if (!parent || !newChild || !oldChild) return false;
  try {
    parent.replaceChild(newChild, oldChild);
    return true;
  } catch {
    return false;
  }
}

// Element creation
export function createElementSafely(tagName: string): Element | null {
  if (!isBrowser) return null;
  try {
    return document.createElement(tagName);
  } catch {
    return null;
  }
}

export function createTextNodeSafely(text: string | number | boolean): Text | null {
  if (!isBrowser) return null;
  try {
    return document.createTextNode(String(text));
  } catch {
    return null;
  }
}

export function createCommentSafely(text: string): Comment | null {
  if (!isBrowser) return null;
  try {
    return document.createComment(text);
  } catch {
    return null;
  }
}

// Consolidated marker utilities
export function createMarkerComment(prefix: string): Comment {
  if (!isBrowser) throw new Error("Cannot create comment in non-browser environment");
  const comment = createCommentSafely(`${prefix}-${Math.random().toString(36).slice(2)}`);
  if (!comment) throw new Error("Failed to create comment");
  return comment;
}

export function createMarkerPair(prefix: string): { start: Comment; end: Comment } {
  const endComment = createCommentSafely(`${prefix}-end`);
  if (!endComment) throw new Error("Failed to create end comment");
  return {
    start: createMarkerComment(`${prefix}-start`),
    end: endComment
  };
}

export function clearBetweenMarkers(startMarker: Comment, endMarker: Comment): void {
  let current = startMarker.nextSibling;
  while (current && current !== endMarker) {
    const next = current.nextSibling;
    safeRemoveChild(current);
    current = next;
  }
}

export function insertNodesBefore(nodes: Node[], referenceNode: Node): void {
  const parent = referenceNode.parentNode;
  if (parent) {
    nodes.forEach(node => safeInsertBefore(parent, node, referenceNode));
  }
}

// Child management
export function appendChildren(parent: Element | Node, ...children: Array<Element | Node | string | null | undefined>): Element | Node {
  if (!parent) return parent;
  
  children.forEach(child => {
    if (child != null) {
      let nodeToAppend: Node;
      
      if (typeof child === "string") {
        const textNode = createTextNodeSafely(child);
        if (textNode) nodeToAppend = textNode;
        else return;
      } else {
        nodeToAppend = child as Node;
      }

      safeAppendChild(parent, nodeToAppend);
    }
  });

  return parent;
}

// Attribute management
export function setAttributeSafely(element: Element, name: string, value: string | number | boolean): boolean {
  if (!element || !name) return false;
  try {
    element.setAttribute(name, String(value));
    return true;
  } catch {
    return false;
  }
}

export function removeAttributeSafely(element: Element, name: string): boolean {
  if (!element || !name) return false;
  try {
    element.removeAttribute(name);
    return true;
  } catch {
    return false;
  }
}

export function setTextContentSafely(element: Element | Node, text: string): boolean {
  if (!element) return false;
  try {
    if ('textContent' in element) {
      element.textContent = text;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Utility functions
export function isNodeConnected(node: Node | null | undefined): boolean {
  if (!node) return false;
  return typeof node.isConnected === "boolean" ? node.isConnected : document.contains(node);
}

export function getChildElements(parent: Element | Node): Element[] {
  if (!parent || !('children' in parent)) return [];
  try {
    return Array.from(parent.children);
  } catch {
    return [];
  }
}

export function dispatchEventSafely(element: Element | Node, eventName: string, detail?: any): boolean {
  if (!element || !eventName) return false;
  try {
    const event = new CustomEvent(eventName, { detail, bubbles: true, cancelable: true });
    return element.dispatchEvent(event);
  } catch {
    return false;
  }
}