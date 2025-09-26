/**
 * Node factory adapter that abstracts DOM node creation across SSR, hydration, and browser modes
 */
import { isSSR, isHydrating } from './runtimeContext';

// Import virtual nodes directly to avoid dynamic import issues
import * as VirtualNodes from '../core/ssr/virtualNodes';

// Track current hydration parent context
let hydrationContext: { parent: Node | null } = { parent: null };

export function setHydrationParent(parent: Node | null): void {
  hydrationContext.parent = parent;
}

// Import hydration module directly
import { claimChild } from '../core/hydration';

export function createElement(tagName: string, parent?: Node): Element | any {
  if (isSSR()) {
    return new VirtualNodes.VElement(tagName);
  }
  
  if (isHydrating() && (parent || hydrationContext.parent)) {
    const claimParent = parent || hydrationContext.parent;
    const existing = claimChild(claimParent!, "element", tagName);
    if (existing) {
      return existing;
    }
  }
  
  return document.createElement(tagName);
}

export function createText(data: string, parent?: Node): Text | any {
  if (isSSR()) {
    return new VirtualNodes.VText(data);
  }
  
  if (isHydrating() && (parent || hydrationContext.parent)) {
    const claimParent = parent || hydrationContext.parent;
    const existing = claimChild(claimParent!, "text");
    if (existing && existing.nodeType === Node.TEXT_NODE) {
      // Update text content if it differs from SSR output
      if (existing.textContent !== data) {
        existing.textContent = data;
      }
      return existing;
    }
  }
  
  return document.createTextNode(data);
}

export function createComment(data: string, parent?: Node): Comment | any {
  if (isSSR()) {
    return new VirtualNodes.VComment(data);
  }
  
  if (isHydrating() && (parent || hydrationContext.parent)) {
    const claimParent = parent || hydrationContext.parent;
    const existing = claimChild(claimParent!, "comment");
    if (existing) {
      return existing;
    }
  }
  
  return document.createComment(data);
}

export function appendChild(parent: any, child: any): void {
  if (isSSR()) {
    parent.appendChild(child);
  } else {
    (parent as Node).appendChild(child as Node);
  }
}

export function insertBefore(parent: any, newChild: any, referenceChild: any): void {
  if (isSSR()) {
    parent.insertBefore(newChild, referenceChild);
  } else {
    (parent as Node).insertBefore(newChild as Node, referenceChild as Node | null);
  }
}

export function setAttribute(element: any, name: string, value: string): void {
  if (isSSR()) {
    element.setAttribute(name, value);
  } else {
    (element as Element).setAttribute(name, value);
  }
}