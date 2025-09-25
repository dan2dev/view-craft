import { logError, handleDOMError, ErrorContext } from "./errorHandler";
import { canUseDOMAPIs, createSafeElement, createSafeTextNode, createSafeComment } from "./environment";

/**
 * Enhanced DOM utilities with better error handling and safety checks
 */

/**
 * Safely appends a child to a parent element with error handling
 */
export function safeAppendChild(parent: Element | Node, child: Node): boolean {
  try {
    if (!parent || !child) {
      return false;
    }

    if ("appendChild" in parent) {
      parent.appendChild(child);
      return true;
    }
    
    return false;
  } catch (error) {
    handleDOMError(error, "appendChild", parent as Element);
    return false;
  }
}

/**
 * Safely removes a child from its parent with error handling
 */
export function safeRemoveChild(child: Node): boolean {
  try {
    if (!child || !child.parentNode) {
      return false;
    }

    child.parentNode.removeChild(child);
    return true;
  } catch (error) {
    handleDOMError(error, "removeChild", child);
    return false;
  }
}

/**
 * Safely inserts a node before a reference node
 */
export function safeInsertBefore(parent: Node, newNode: Node, referenceNode: Node | null): boolean {
  try {
    if (!parent || !newNode) {
      return false;
    }

    if ("insertBefore" in parent) {
      parent.insertBefore(newNode, referenceNode);
      return true;
    }

    return false;
  } catch (error) {
    handleDOMError(error, "insertBefore", parent as Element);
    return false;
  }
}

/**
 * Safely replaces one node with another
 */
export function safeReplaceChild(parent: Node, newChild: Node, oldChild: Node): boolean {
  try {
    if (!parent || !newChild || !oldChild) {
      return false;
    }

    if ("replaceChild" in parent) {
      parent.replaceChild(newChild, oldChild);
      return true;
    }

    return false;
  } catch (error) {
    handleDOMError(error, "replaceChild", parent as Element);
    return false;
  }
}

/**
 * Creates a DOM element safely with error handling
 */
export function createElementSafely(tagName: string): Element | null {
  if (!canUseDOMAPIs()) {
    logError("DOM APIs not available", new Error("Environment check failed"), {
      operation: "createElement",
      tagName
    });
    return null;
  }

  return createSafeElement(tagName);
}

/**
 * Creates a text node safely with error handling
 */
export function createTextNodeSafely(text: string | number | boolean): Text | null {
  if (!canUseDOMAPIs()) {
    logError("DOM APIs not available", new Error("Environment check failed"), {
      operation: "createTextNode"
    });
    return null;
  }

  const textContent = text == null ? String(text) : String(text);
  return createSafeTextNode(textContent);
}

/**
 * Creates a comment node safely with error handling
 */
export function createCommentSafely(text: string): Comment | null {
  if (!canUseDOMAPIs()) {
    logError("DOM APIs not available", new Error("Environment check failed"), {
      operation: "createComment"
    });
    return null;
  }

  return createSafeComment(text);
}

/**
 * Appends multiple child nodes to a parent element
 */
export function appendChildren(parent: Element | Node, ...children: Array<Element | Node | string | null | undefined>): Element | Node {
  if (!parent) {
    return parent;
  }

  const context: ErrorContext = {
    operation: "appendChildren",
    tagName: (parent as Element).tagName?.toLowerCase(),
    additionalInfo: {
      childrenCount: children.length,
      parentNodeType: parent.nodeType
    }
  };

  children.forEach((child, index) => {
    if (child != null) {
      let nodeToAppend: Node;
      
      if (typeof child === "string") {
        const textNode = createTextNodeSafely(child);
        if (!textNode) {
          logError(
            `Failed to create text node at index ${index}`,
            new Error("createTextNode failed"),
            context,
            "warn"
          );
          return;
        }
        nodeToAppend = textNode;
      } else {
        nodeToAppend = child as Node;
      }

      const success = safeAppendChild(parent, nodeToAppend);
      if (!success) {
        logError(
          `Failed to append child at index ${index}`,
          new Error("appendChild failed"),
          context,
          "warn"
        );
      }
    }
  });

  return parent;
}

/**
 * Sets text content on an element safely
 */
export function setTextContentSafely(element: Element | Node, text: string): boolean {
  try {
    if (!element) {
      return false;
    }

    if ("textContent" in element) {
      element.textContent = text;
      return true;
    }

    return false;
  } catch (error) {
    handleDOMError(error, "setTextContent", element as Element);
    return false;
  }
}

/**
 * Sets an attribute on an element safely
 */
export function setAttributeSafely(element: Element, name: string, value: string | number | boolean): boolean {
  try {
    if (!element || !name) {
      return false;
    }

    if ("setAttribute" in element) {
      element.setAttribute(name, String(value));
      return true;
    }

    return false;
  } catch (error) {
    handleDOMError(error, "setAttribute", element);
    return false;
  }
}

/**
 * Removes an attribute from an element safely
 */
export function removeAttributeSafely(element: Element, name: string): boolean {
  try {
    if (!element || !name) {
      return false;
    }

    if ("removeAttribute" in element) {
      element.removeAttribute(name);
      return true;
    }

    return false;
  } catch (error) {
    handleDOMError(error, "removeAttribute", element);
    return false;
  }
}

/**
 * Gets the computed style of an element safely
 */
export function getComputedStyleSafely(element: Element): CSSStyleDeclaration | null {
  try {
    if (!element || typeof getComputedStyle === "undefined") {
      return null;
    }

    return getComputedStyle(element);
  } catch (error) {
    handleDOMError(error, "getComputedStyle", element);
    return null;
  }
}

/**
 * Checks if a node is connected to the document
 */
export function isNodeConnected(node: Node | null | undefined): boolean {
  if (!node) {
    return false;
  }

  // Use isConnected if available (modern browsers)
  if (typeof node.isConnected === "boolean") {
    return node.isConnected;
  }

  // Fallback for older browsers
  return document.contains(node);
}

/**
 * Gets all child elements of a parent (excluding text nodes and comments)
 */
export function getChildElements(parent: Element | Node): Element[] {
  if (!parent || !("children" in parent)) {
    return [];
  }

  try {
    return Array.from(parent.children);
  } catch (error) {
    handleDOMError(error, "getChildElements", parent as Element);
    return [];
  }
}

/**
 * Gets all child nodes of a parent (including text nodes and comments)
 */
export function getChildNodes(parent: Node): Node[] {
  if (!parent || !parent.childNodes) {
    return [];
  }

  try {
    return Array.from(parent.childNodes);
  } catch (error) {
    handleDOMError(error, "getChildNodes", parent);
    return [];
  }
}

/**
 * Finds the closest ancestor element that matches a selector
 */
export function findClosestAncestor(element: Element, selector: string): Element | null {
  try {
    if (!element || !selector) {
      return null;
    }

    if ("closest" in element && typeof element.closest === "function") {
      return element.closest(selector);
    }

    // Fallback for browsers without closest()
    let current: Element | null = (element as Element).parentElement;
    while (current) {
      if (current.matches && current.matches(selector)) {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  } catch (error) {
    handleDOMError(error, "findClosestAncestor", element);
    return null;
  }
}

/**
 * Dispatches a custom event on an element safely
 */
export function dispatchEventSafely(
  element: Element | Node,
  eventName: string,
  detail?: any,
  options?: EventInit
): boolean {
  try {
    if (!element || !eventName) {
      return false;
    }

    if ("dispatchEvent" in element) {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true,
        ...options
      });

      return element.dispatchEvent(event);
    }

    return false;
  } catch (error) {
    handleDOMError(error, "dispatchEvent", element as Element);
    return false;
  }
}