import { applyNodeModifier } from "./modifierProcessor";
import { isBrowser } from "../utility/environment";

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

interface ConditionalInfo {
  condition: () => boolean;
  tagName: string;
  modifiers: Array<NodeMod<any> | NodeModFn<any>>;
}



/**
 * Updates all conditional elements and comments
 */
export function updateConditionalElements(): void {
  if (!isBrowser) return;

  // Find all conditional elements and comments in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as any)._conditionalInfo) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (node.nodeType === Node.COMMENT_NODE && (node as any)._conditionalInfo) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodesToUpdate: Array<Element | Comment> = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    nodesToUpdate.push(node as Element | Comment);
  }

  // Update each conditional node
  nodesToUpdate.forEach(node => {
    const conditionalInfo = (node as any)._conditionalInfo as ConditionalInfo | undefined;
    if (!conditionalInfo) return;

    const shouldShow = conditionalInfo.condition();
    const isElement = node.nodeType === Node.ELEMENT_NODE;

    if (shouldShow && !isElement) {
      // Currently hidden (comment), should show - replace with element
      const element = document.createElement(conditionalInfo.tagName);
      let localIndex = 0;

      conditionalInfo.modifiers.forEach((modifier) => {
        const renderedNode = applyNodeModifier(element, modifier, localIndex);
        if (renderedNode) {
          const renderedDomNode = renderedNode as Node;
          const parentNode = element as unknown as Node & ParentNode;
          if (renderedDomNode.parentNode !== parentNode) {
            parentNode.appendChild(renderedDomNode);
          }
          localIndex += 1;
        }
      });

      // Store conditional info on new element
      (element as any)._conditionalInfo = conditionalInfo;

      // Replace comment with element
      if (node.parentNode) {
        node.parentNode.replaceChild(element, node);
      }

    } else if (!shouldShow && isElement) {
      // Currently shown (element), should hide - replace with comment
      const comment = document.createComment(`conditional-${conditionalInfo.tagName}-hidden`);
      (comment as any)._conditionalInfo = conditionalInfo;

      // Replace element with comment
      if (node.parentNode) {
        node.parentNode.replaceChild(comment, node);
      }
    }
    // If shouldShow matches current state (element/comment), no change needed
  });
}