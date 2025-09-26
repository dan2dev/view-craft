/**
 * Hydration support for reusing server-rendered DOM nodes
 */
import { setRuntimeMode, getRuntimeMode } from '../utility/runtimeContext';
import { resetMarkerCounter } from '../utility/dom';

// Hydration state
const hydrationState = new WeakMap<Node, number>();
let isHydrationActive = false;

/**
 * Begin hydration mode and initialize claiming state
 */
export function beginHydration(root: Element): void {
  setRuntimeMode("hydrate");
  isHydrationActive = true;
  resetMarkerCounter(); // Reset for consistent claiming
  
  // Initialize claim index for root
  hydrationState.set(root, 0);
}

/**
 * End hydration mode and return to browser mode
 */
export function endHydration(): void {
  setRuntimeMode("browser");
  isHydrationActive = false;
  // Clear hydration state (WeakMap doesn't have clear method in all environments)
  // hydrationState.clear();
}

/**
 * Check if hydration is currently active
 */
export function isHydrating(): boolean {
  return isHydrationActive;
}

/**
 * Claim the next child node from parent if it matches expectations
 */
export function claimChild(
  parent: Node, 
  expectedKind: "element" | "text" | "comment", 
  tagName?: string
): Node | null {
  if (!isHydrationActive) {
    return null;
  }

  let claimIndex = hydrationState.get(parent) || 0;
  const children = parent.childNodes;
  
  if (claimIndex >= children.length) {
    return null;
  }

  const child = children[claimIndex];
  let matches = false;

  switch (expectedKind) {
    case "element":
      matches = child.nodeType === Node.ELEMENT_NODE && 
                (!tagName || (child as Element).tagName.toLowerCase() === tagName.toLowerCase());
      break;
    case "text":
      matches = child.nodeType === Node.TEXT_NODE;
      break;
    case "comment":
      matches = child.nodeType === Node.COMMENT_NODE;
      break;
  }

  if (matches) {
    hydrationState.set(parent, claimIndex + 1);
    
    // Initialize claiming state for element nodes
    if (child.nodeType === Node.ELEMENT_NODE) {
      hydrationState.set(child, 0);
    }
    
    return child;
  }

  return null;
}

/**
 * High-level hydration API
 */
export function hydrate(
  root: Element, 
  viewBuilder: (parent: any, index: number) => any
): void {
  const originalMode = getRuntimeMode();
  
  try {
    beginHydration(root);
    
    // Run the view builder with hydration claiming
    viewBuilder(root, 0);
    
  } finally {
    endHydration();
    // Restore original mode if it wasn't browser
    if (originalMode !== "browser") {
      setRuntimeMode(originalMode);
    }
  }
}