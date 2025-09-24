/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { list, update } from '../src/index';

describe('Performance Demo - Minimal DOM Operations', () => {
  let container: HTMLElement;
  let items: Array<{ id: number; name: string; price: number }>;
  let data: { color: string };

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    
    items = [
      { id: 1, name: 'Item 1', price: 10 },
      { id: 2, name: 'Item 2', price: 20 },
      { id: 3, name: 'Item 3', price: 30 }
    ];

    data = { color: 'red' };
  });

  it('should demonstrate your exact use case with minimal DOM operations', () => {
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
      // Your exact use case implementation (simplified)
      const listFn = list(() => items, (item) => {
        const div = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'delete';
        deleteButton.addEventListener('click', () => {
          items = items.filter(i => i.id !== item.id);
          update();
        });
        
        div.innerHTML = `${item.name} --- ${item.price}`;
        div.appendChild(deleteButton);
        div.style.color = data.color;
        return div as any;
      });

      listFn(container as any, 0);

      // Verify initial render
      let elements = Array.from(container.querySelectorAll('div > div'));
      expect(elements).toHaveLength(3);
      
      // Reset counters after initial render
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      console.log('=== PERFORMANCE DEMO ===');
      console.log('Initial items:', items.length);

      // Test 1: Add single item - should only create 1 new element
      console.log('\n1. Adding single item...');
      items = [...items, { id: 4, name: 'Item 4', price: 40 }];
      update();

      elements = Array.from(container.querySelectorAll('div > div'));
      expect(elements).toHaveLength(4);
      
      console.log(`   DOM operations: ${insertBeforeCallCount} insertBefore calls`);
      console.log(`   Result: Only 1 new element created, existing elements untouched ✅`);
      expect(insertBeforeCallCount).toBe(1); // Only 1 insert for the new item
      expect(removeChildCallCount).toBe(0);

      // Reset counters
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // Test 2: Add multiple items at once
      console.log('\n2. Adding multiple items...');
      items = [...items, 
        { id: 5, name: 'Item 5', price: 50 },
        { id: 6, name: 'Item 6', price: 60 }
      ];
      update();

      elements = Array.from(container.querySelectorAll('div > div'));
      expect(elements).toHaveLength(6);
      
      console.log(`   DOM operations: ${insertBeforeCallCount} insertBefore calls`);
      console.log(`   Result: Only 2 new elements created for 2 new items ✅`);
      expect(insertBeforeCallCount).toBe(2); // Only 2 inserts for the 2 new items

      // Reset counters
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // Test 3: Remove item using delete button functionality
      console.log('\n3. Removing single item...');
      items = items.filter(i => i.id !== 2);
      update();

      elements = Array.from(container.querySelectorAll('div > div'));
      expect(elements).toHaveLength(5);
      
      console.log(`   DOM operations: ${removeChildCallCount} removeChild calls`);
      console.log(`   Result: Only 1 element removed, others untouched ✅`);
      expect(removeChildCallCount).toBe(1); // Only 1 remove operation
      // Should not need to move other elements
      expect(insertBeforeCallCount).toBeLessThanOrEqual(1);

      // Reset counters
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // Test 4: Replace entire array (your main use case)
      console.log('\n4. Replacing entire array...');
      const oldItemsCount = items.length;
      items = [
        { id: 100, name: 'New Item 1', price: 100 },
        { id: 101, name: 'New Item 2', price: 110 },
      ];
      update();

      elements = Array.from(container.querySelectorAll('div > div'));
      expect(elements).toHaveLength(2);
      
      console.log(`   DOM operations: ${removeChildCallCount} removes, ${insertBeforeCallCount} inserts`);
      console.log(`   Result: Efficient replacement of ${oldItemsCount} items with 2 new items ✅`);
      
      // Should remove old items and add new ones
      expect(removeChildCallCount).toBe(oldItemsCount);
      expect(insertBeforeCallCount).toBe(2);

      // Reset counters
      insertBeforeCallCount = 0;
      removeChildCallCount = 0;

      // Test 5: No change - should be zero operations
      console.log('\n5. Calling update() with no changes...');
      update();
      
      console.log(`   DOM operations: ${insertBeforeCallCount} insertBefore, ${removeChildCallCount} removeChild`);
      console.log(`   Result: No unnecessary operations ✅`);
      expect(insertBeforeCallCount).toBe(0);
      expect(removeChildCallCount).toBe(0);

      console.log('\n=== PERFORMANCE DEMO COMPLETE ===');
      console.log('✅ All optimizations working correctly!');
      console.log('✅ Minimal DOM operations achieved!');
      console.log('✅ Your use case is fully optimized!');

    } finally {
      // Restore original methods
      Node.prototype.insertBefore = originalInsertBefore;
      Node.prototype.removeChild = originalRemoveChild;
    }
  });

  it('should handle reactive color updates without touching list structure', () => {
    let insertBeforeCallCount = 0;
    
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function<T extends Node>(this: T, child: Node, reference: Node | null): T {
      insertBeforeCallCount++;
      return originalInsertBefore.call(this, child, reference) as T;
    };

    try {
      const listFn = list(() => items, (item) => {
        const div = document.createElement('div');
        div.textContent = `${item.name} --- Color: ${data.color}`;
        return div as any;
      });

      listFn(container as any, 0);
      
      // Reset counter after initial render
      insertBeforeCallCount = 0;

      // Change reactive data (not the list)
      data.color = 'blue';
      update();

      // Should not cause list restructuring
      expect(insertBeforeCallCount).toBe(0);
      console.log('✅ Reactive updates don\'t affect list structure');

    } finally {
      Node.prototype.insertBefore = originalInsertBefore;
    }
  });
});