/**
 * Creates a unique comment marker for tracking dynamic content.
 */
export function createMarkerComment(prefix: string): Comment {
  return document.createComment(`${prefix}-${Math.random().toString(36).slice(2)}`);
}

/**
 * Creates start and end comment markers for wrapping dynamic content.
 */
export function createMarkerPair(prefix: string): { start: Comment; end: Comment } {
  return {
    start: createMarkerComment(`${prefix}-start`),
    end: document.createComment(`${prefix}-end`)
  };
}

/**
 * Removes all nodes between two comment markers.
 */
export function clearBetweenMarkers(startMarker: Comment, endMarker: Comment): void {
  let current = startMarker.nextSibling;
  while (current && current !== endMarker) {
    const next = current.nextSibling;
    current.parentNode?.removeChild(current);
    current = next;
  }
}

/**
 * Inserts nodes before a reference node.
 */
export function insertNodesBefore(nodes: Node[], referenceNode: Node): void {
  const parent = referenceNode.parentNode;
  if (parent) {
    nodes.forEach(node => {
      parent.insertBefore(node, referenceNode);
    });
  }
}

/**
 * Gets the parent node that can contain child elements.
 */
export function getContainerParent(node: Node): (Node & ParentNode) | null {
  return node.parentNode as (Node & ParentNode) | null;
}

/**
 * Removes a node from its parent if it exists.
 */
export function safeRemoveNode(node: Node): void {
  node.parentNode?.removeChild(node);
}