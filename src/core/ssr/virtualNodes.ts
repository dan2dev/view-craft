/**
 * Virtual DOM nodes for SSR - minimal implementation that matches DOM Node interface
 */

import { SELF_CLOSING_TAGS } from '../tagRegistry';

export const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8
} as const;

export interface VirtualNode {
  nodeType: number;
  nodeName: string;
  textContent?: string;
  childNodes: VirtualNode[];
  parentNode: VirtualNode | null;
  appendChild(child: VirtualNode): void;
  insertBefore(newChild: VirtualNode, referenceChild: VirtualNode | null): void;
  removeChild(child: VirtualNode): void;
}

export class VElement implements VirtualNode {
  nodeType = NODE_TYPE.ELEMENT;
  nodeName: string;
  tagName: string;
  childNodes: VirtualNode[] = [];
  parentNode: VirtualNode | null = null;
  attributes = new Map<string, string>();

  constructor(tagName: string) {
    this.tagName = tagName.toLowerCase();
    this.nodeName = tagName.toUpperCase();
  }

  get textContent(): string {
    return this.childNodes
      .map(child => child.textContent || '')
      .join('');
  }

  set textContent(value: string) {
    this.childNodes = [];
    if (value) {
      this.appendChild(new VText(value));
    }
  }

  appendChild(child: VirtualNode): void {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    child.parentNode = this;
    this.childNodes.push(child);
  }

  insertBefore(newChild: VirtualNode, referenceChild: VirtualNode | null): void {
    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }

    newChild.parentNode = this;

    if (!referenceChild) {
      this.childNodes.push(newChild);
      return;
    }

    const index = this.childNodes.indexOf(referenceChild);
    if (index === -1) {
      this.childNodes.push(newChild);
    } else {
      this.childNodes.splice(index, 0, newChild);
    }
  }

  removeChild(child: VirtualNode): void {
    const index = this.childNodes.indexOf(child);
    if (index !== -1) {
      this.childNodes.splice(index, 1);
      child.parentNode = null;
    }
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) || null;
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
}

export class VText implements VirtualNode {
  nodeType = NODE_TYPE.TEXT;
  nodeName = "#text";
  childNodes: VirtualNode[] = [];
  parentNode: VirtualNode | null = null;
  textContent: string;

  constructor(data: string) {
    this.textContent = data;
  }

  appendChild(): void {
    throw new Error('Text nodes cannot have children');
  }

  insertBefore(): void {
    throw new Error('Text nodes cannot have children');
  }

  removeChild(): void {
    throw new Error('Text nodes cannot have children');
  }
}

export class VComment implements VirtualNode {
  nodeType = NODE_TYPE.COMMENT;
  nodeName = "#comment";
  childNodes: VirtualNode[] = [];
  parentNode: VirtualNode | null = null;
  textContent: string;

  constructor(data: string) {
    this.textContent = data;
  }

  appendChild(): void {
    throw new Error('Comment nodes cannot have children');
  }

  insertBefore(): void {
    throw new Error('Comment nodes cannot have children');
  }

  removeChild(): void {
    throw new Error('Comment nodes cannot have children');
  }
}

export interface SerializeOptions {
  unwrap?: boolean;
  pretty?: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function serializeAttributes(element: VElement): string {
  if (element.attributes.size === 0) {
    return '';
  }

  const attrs: string[] = [];
  for (const [name, value] of element.attributes) {
    if (value === undefined || value === null) {
      continue;
    }
    attrs.push(`${name}="${escapeAttribute(value)}"`);
  }

  return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
}

function serializeNode(node: VirtualNode): string {
  switch (node.nodeType) {
    case NODE_TYPE.ELEMENT: {
      const element = node as VElement;
      const tagName = element.tagName;
      const attributes = serializeAttributes(element);
      
      // Handle self-closing tags
      if (SELF_CLOSING_TAGS.includes(tagName as any)) {
        return `<${tagName}${attributes}>`;
      }

      // Regular elements
      const children = element.childNodes.map(serializeNode).join('');
      return `<${tagName}${attributes}>${children}</${tagName}>`;
    }

    case NODE_TYPE.TEXT: {
      return escapeHtml(node.textContent || '');
    }

    case NODE_TYPE.COMMENT: {
      return `<!--${node.textContent || ''}-->`;
    }

    default:
      return '';
  }
}

export function serialize(node: VirtualNode, options: SerializeOptions = {}): string {
  if (options.unwrap && node.nodeType === NODE_TYPE.ELEMENT) {
    const element = node as VElement;
    return element.childNodes.map(serializeNode).join('');
  }

  return serializeNode(node);
}