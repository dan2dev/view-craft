import { applyModifiers } from "../internal/applyModifiers";
import { isBrowser } from "../utility/environment";
import {
  ConditionalInfo,
  getConditionalInfo,
  storeConditionalInfo,
  getActiveConditionalNodes,
  unregisterConditionalNode,
} from "../utility/conditionalInfo";
import { runCondition } from "../utility/conditions";
import { createElement, createComment } from "../utility/nodeFactory";

/**
 * Conditional Rendering System for TagBuilders
 * 
 * This system enables conditional rendering syntax like:
 * div(() => condition, "content", { className: "test" })
 * 
 * How it works:
 * 1. When TagBuilder detects first modifier is boolean function, creates element or comment based on condition
 * 2. Stores conditional info on the DOM node using _conditionalInfo property
 * 3. A lightweight registry tracks conditional nodes; updates iterate only that set
 * 4. Elements are replaced with comments when hidden, comments with elements when shown
 * 
 * This approach reuses existing infrastructure while providing the requested TagBuilder syntax.
 */

/**
 * Creates a new element with the given conditional info
 */
function createElementFromConditionalInfo(conditionalInfo: ConditionalInfo): Element {
  const element = createElement(conditionalInfo.tagName);
  // Use shared helper to apply modifiers (handles appending + indexing)

  try {
    applyModifiers(
      element as any,
      conditionalInfo.modifiers as ReadonlyArray<NodeMod<any> | NodeModFn<any>>,
      0
    );
  } catch (error) {
    console.error(`Error applying modifiers in conditional element "${conditionalInfo.tagName}":`, error);
  }
  return element;

}

/**
 * Creates a comment placeholder for hidden conditional content
 */
function createCommentPlaceholder(conditionalInfo: ConditionalInfo): Comment {
  return createComment(`conditional-${conditionalInfo.tagName}-hidden`);
}

/**
 * Replaces one node with another in the DOM
 */
function replaceNodeSafely(oldNode: Node, newNode: Node): void {
  if (oldNode.parentNode) {
    try {
      oldNode.parentNode.replaceChild(newNode, oldNode);
    } catch (error) {
      console.error("Error replacing conditional node:", error);
    }
  }
}

/**
 * Updates a single conditional node
 */
function updateConditionalNode(node: Element | Comment): void {
  const conditionalInfo = getConditionalInfo(node);
  if (!conditionalInfo) {
    return;
  }

  const shouldShow = runCondition(conditionalInfo.condition, (error) => {
    console.error("Error evaluating conditional condition:", error);
  });
  const isElement = node.nodeType === Node.ELEMENT_NODE;

  if (shouldShow && !isElement) {
    // Currently hidden (comment), should show - replace with element
    const element = createElementFromConditionalInfo(conditionalInfo);
    storeConditionalInfo(element, conditionalInfo);
    replaceNodeSafely(node, element);

  } else if (!shouldShow && isElement) {
    // Currently shown (element), should hide - replace with comment
    const comment = createCommentPlaceholder(conditionalInfo);
    storeConditionalInfo(comment, conditionalInfo);
    replaceNodeSafely(node, comment);
  }
  // If shouldShow matches current state (element/comment), no change needed
}

/**
 * (Removed) Previous implementation walked the entire DOM tree each update.
 * Registry-based approach (see conditionalInfo.ts) makes this unnecessary.
 * Keeping placeholder block to preserve line numbering stability.
 *
 * Legacy code replaced by a no-op function (not exported) for compatibility
 * in case of any accidental references.
 */
function findConditionalNodes(): Array<Element | Comment> {
  // Deprecated: return empty; real updates use getActiveConditionalNodes()
  return [];
}

/**
 * Updates all conditional elements and comments
 */
export function updateConditionalElements(): void {
  if (!isBrowser) {
    return;
  }

  try {
    // Iterate only tracked conditional nodes (O(nConditionals))
    getActiveConditionalNodes().forEach((node) => {
      if (!node.isConnected) {
        // Prune disconnected node from registry to avoid memory growth
        unregisterConditionalNode(node);
        return;
      }
      updateConditionalNode(node as Element | Comment);
    });
  } catch (error) {
    console.error("Error during conditional elements update:", error);
  }
}
