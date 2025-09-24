/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { list, update } from '../src/index';

describe('Function-based List API', () => {
  let container: HTMLElement;
  let items: Array<{ id: number; name: string; price: number }>;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    
    items = [
      { id: 1, name: 'Item 1', price: 10 },
      { id: 2, name: 'Item 2', price: 20 },
      { id: 3, name: 'Item 3', price: 30 }
    ];
  });

  it('should work with function that returns array', () => {
    const listFn = list(() => items, (item) => {
      const div = document.createElement('div');
      div.textContent = `${item.name} - $${item.price}`;
      div.setAttribute('data-item-id', item.id.toString());
      return div as any;
    });

    listFn(container as any, 0);

    const elements = Array.from(container.querySelectorAll('[data-item-id]'));
    expect(elements).toHaveLength(3);
    expect(elements[0].textContent).toBe('Item 1 - $10');
    expect(elements[1].textContent).toBe('Item 2 - $20');
    expect(elements[2].textContent).toBe('Item 3 - $30');
  });

  it('should update when function returns new array', () => {
    const listFn = list(() => items, (item) => {
      const div = document.createElement('div');
      div.textContent = item.name;
      div.setAttribute('data-item-id', item.id.toString());
      return div as any;
    });

    listFn(container as any, 0);

    // Initial state
    let elements = Array.from(container.querySelectorAll('[data-item-id]'));
    expect(elements).toHaveLength(3);

    // Change the array to a new one
    items = [
      { id: 4, name: 'Item 4', price: 40 },
      { id: 1, name: 'Item 1', price: 10 }, // Keep one existing
      { id: 5, name: 'Item 5', price: 50 }
    ];

    update();

    elements = Array.from(container.querySelectorAll('[data-item-id]'));
    expect(elements).toHaveLength(3);
    expect(elements[0].textContent).toBe('Item 4');
    expect(elements[1].textContent).toBe('Item 1');
    expect(elements[2].textContent).toBe('Item 5');
  });

  it('should handle adding items to new array', () => {
    const listFn = list(() => items, (item) => {
      const div = document.createElement('div');
      div.textContent = item.name;
      return div as any;
    });

    listFn(container as any, 0);

    // Add item by creating new array
    items = [...items, { id: 4, name: 'Item 4', price: 40 }];
    update();

    const elements = Array.from(container.querySelectorAll('div'));
    expect(elements).toHaveLength(4);
    expect(elements[3].textContent).toBe('Item 4');
  });

  it('should handle removing items with new array', () => {
    const listFn = list(() => items, (item) => {
      const div = document.createElement('div');
      div.textContent = item.name;
      return div as any;
    });

    listFn(container as any, 0);

    // Remove item by creating new array
    items = items.filter(item => item.id !== 2);
    update();

    const elements = Array.from(container.querySelectorAll('div'));
    expect(elements).toHaveLength(2);
    expect(elements[0].textContent).toBe('Item 1');
    expect(elements[1].textContent).toBe('Item 3');
  });

  it('should work with empty array', () => {
    const listFn = list(() => items, (item) => {
      const div = document.createElement('div');
      div.textContent = item.name;
      return div as any;
    });

    listFn(container as any, 0);

    // Clear items
    items = [];
    update();

    const elements = Array.from(container.querySelectorAll('div'));
    expect(elements).toHaveLength(0);
  });

  it('should work when function returns different array instances', () => {
    let currentItems = [...items];
    
    const listFn = list(() => currentItems, (item) => {
      const div = document.createElement('div');
      div.textContent = item.name;
      return div as any;
    });

    listFn(container as any, 0);

    // Change to completely different array
    currentItems = [{ id: 10, name: 'New Item', price: 100 }];
    update();

    const elements = Array.from(container.querySelectorAll('div'));
    expect(elements).toHaveLength(1);
    expect(elements[0].textContent).toBe('New Item');
  });

  it('should only create/move elements when necessary (performance test)', () => {
    let insertBeforeCallCount = 0;
    let removeChildCallCount = 0;
    
    // Track DOM operations
    const originalInsertBefore = Node.prototype.insertBefore;
    const originalRemoveChild = Node.prototype.removeChild;
    
    Node.prototype.insertBefore = function<T extends Node>(this: T, child: Node, reference: Node | null): T {
      insertBeforeCallCount++;
      return originalInsertBefore.call(this, child, reference) as T;
    };
    
    Node.prototype.removeChild = function<T extends Node>(this: T, child: Node): T {
      removeChildCallCount++;
      return originalRemoveChild.call(this, child) as T;
    };

    try {
      const listFn = list(() => items, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        div.setAttribute('data-item-id', item.id.toString());
        return div as any;
      });

      listFn(container as any, 0);
      
      // Reset counters after initial render
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // Add one new item - should only cause 1 insertBefore operation
      items = [...items, { id: 4, name: 'Item 4', price: 40 }];
      update();

      // Should only insert the new element, not move existing ones
      expect(insertBeforeCallCount).toBe(1);
      expect(removeChildCallCount).toBe(0);

      // Reset counters
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // Remove middle item - should only remove that one element
      items = items.filter(item => item.id !== 2);
      update();

      // Should only remove one element, not move others
      expect(removeChildCallCount).toBe(1);
      // May need to move elements to maintain order, but should be minimal
      expect(insertBeforeCallCount).toBeLessThanOrEqual(1);

      // Reset counters
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // No change - should not trigger any DOM operations
      update();
      
      expect(insertBeforeCallCount).toBe(0);
      expect(removeChildCallCount).toBe(0);

    } finally {
      // Restore original methods
      Node.prototype.insertBefore = originalInsertBefore;
      Node.prototype.removeChild = originalRemoveChild;
    }
  });
});