import { applyNodeModifier } from "./modifierProcessor";
import { isBrowser } from "../utility/environment";
import { 
  ConditionalInfo, 
  hasConditionalInfo, 
  getConditionalInfo 
} from "./conditionalRenderer";

/**
 * Conditional Rendering System for TagBuilders
 * 
 * This system enables conditional rendering syntax like:
 * div(() => condition, "content", { className: "test" })
 * 
 * How it works:
 * 1. When TagBuilder detects first modifier is boolean function, creates element or comment based on condition
 * 2. Stores conditional info on the DOM node using _conditionalInfo property
 * 3. During updates, DOM tree walker finds all conditional nodes and updates them
 * 4. Elements are replaced with comments when hidden, comments with elements when shown
 * 
 * This approach reuses existing infrastructure while providing the requested TagBuilder syntax.
 */

/**
 * Creates a new element with the given conditional info
 */
function createElementFromConditionalInfo(conditionalInfo: ConditionalInfo): Element {
  const element = document.createElement(conditionalInfo.tagName);
  let localIndex = 0;

  conditionalInfo.modifiers.forEach((modifier) => {
    try {
      const renderedNode = applyNodeModifier(element, modifier, localIndex);
      if (renderedNode) {
        const renderedDomNode = renderedNode as Node;
        const parentNode = element as unknown as Node & ParentNode;
        if (renderedDomNode.parentNode !== parentNode) {
          parentNode.appendChild(renderedDomNode);
        }
        localIndex += 1;
      }
    } catch (error) {
      console.error(`Error applying modifier in conditional element "${conditionalInfo.tagName}":`, error);
    }
  });

  return element;
}

/**
 * Creates a comment placeholder for hidden conditional content
 */
function createCommentPlaceholder(conditionalInfo: ConditionalInfo): Comment {
  return document.createComment(`conditional-${conditionalInfo.tagName}-hidden`);
}

/**
 * Attaches conditional info to a node
 */
function attachConditionalInfo(node: Node, conditionalInfo: ConditionalInfo): void {
  (node as any)._conditionalInfo = conditionalInfo;
}

/**
 * Safely evaluates a condition function
 */
function evaluateCondition(condition: () => boolean): boolean {
  try {
    return condition();
  } catch (error) {
    console.error("Error evaluating conditional condition:", error);
    return false; // Default to hidden on error
  }
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

  const shouldShow = evaluateCondition(conditionalInfo.condition);
  const isElement = node.nodeType === Node.ELEMENT_NODE;

  if (shouldShow && !isElement) {
    // Currently hidden (comment), should show - replace with element
    const element = createElementFromConditionalInfo(conditionalInfo);
    attachConditionalInfo(element, conditionalInfo);
    replaceNodeSafely(node, element);

  } else if (!shouldShow && isElement) {
    // Currently shown (element), should hide - replace with comment
    const comment = createCommentPlaceholder(conditionalInfo);
    attachConditionalInfo(comment, conditionalInfo);
    replaceNodeSafely(node, comment);
  }
  // If shouldShow matches current state (element/comment), no change needed
}

/**
 * Finds all conditional nodes in the document
 */
function findConditionalNodes(): Array<Element | Comment> {
  if (!document.body) {
    return [];
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
    {
      acceptNode: (node) => {
        return hasConditionalInfo(node) 
          ? NodeFilter.FILTER_ACCEPT 
          : NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodes: Array<Element | Comment> = [];
  let node: Node | null;
  
  while ((node = walker.nextNode())) {
    nodes.push(node as Element | Comment);
  }

  return nodes;
}

/**
 * Updates all conditional elements and comments
 */
export function updateConditionalElements(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const conditionalNodes = findConditionalNodes();
    conditionalNodes.forEach(updateConditionalNode);
  } catch (error) {
    console.error("Error during conditional elements update:", error);
  }
}

/**
 * Cleans up disconnected conditional nodes from memory
 */
export function cleanupConditionalElements(): void {
  if (!isBrowser() || !document.body) {
    return;
  }

  // This function could be extended to maintain a registry of conditional nodes
  // for more efficient cleanup, but for now we rely on the tree walker approach
  // which automatically skips disconnected nodes
}