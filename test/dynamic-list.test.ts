// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { list, update } from '../src/dynamic-list.js';

describe('Dynamic List', () => {
  let testItems: Array<{ id: number; name: string; }>;
  let container: HTMLElement;

  beforeEach(() => {
    testItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('list function', () => {
    it('should create a list container function', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      expect(typeof listFn).toBe('function');
    });

    it('should render initial items', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        div.setAttribute('data-item-id', item.id.toString());
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;

      expect(listContainer).toBeDefined();
      expect(listContainer.children).toHaveLength(3);
      expect(listContainer.children[0].textContent).toBe('Item 1');
      expect(listContainer.children[1].textContent).toBe('Item 2');
      expect(listContainer.children[2].textContent).toBe('Item 3');
    });

    it('should pass correct item and index to render function', () => {
      const renderCalls: Array<{ item: any; index: number }> = [];

      const listFn = list(testItems, (item, index) => {
        renderCalls.push({ item, index });
        const div = document.createElement('div');
        div.textContent = `${item.name} - ${index}`;
        return div as any;
      });

      listFn(container as any, 0) as HTMLElement;

      expect(renderCalls).toHaveLength(3);
      expect(renderCalls[0]).toEqual({ item: testItems[0], index: 0 });
      expect(renderCalls[1]).toEqual({ item: testItems[1], index: 1 });
      expect(renderCalls[2]).toEqual({ item: testItems[2], index: 2 });
    });

    it('should create a container with data-dynamic-list attribute', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;

      expect(listContainer.getAttribute('data-dynamic-list')).toBe('true');
    });

    it('should handle empty arrays', () => {
      const emptyItems: any[] = [];
      const listFn = list(emptyItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;

      expect(listContainer.children).toHaveLength(0);
    });
  });

  describe('update function', () => {
    it('should update list when items are added', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;
      container.appendChild(listContainer);

      expect(listContainer.children).toHaveLength(3);

      // Add item to array
      testItems.push({ id: 4, name: 'Item 4' });
      update();

      expect(listContainer.children).toHaveLength(4);
      expect(listContainer.children[3].textContent).toBe('Item 4');
    });

    it('should update list when items are removed', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;
      container.appendChild(listContainer);

      expect(listContainer.children).toHaveLength(3);

      // Remove item from array
      testItems.pop();
      update();

      expect(listContainer.children).toHaveLength(2);
      expect(listContainer.children[0].textContent).toBe('Item 1');
      expect(listContainer.children[1].textContent).toBe('Item 2');
    });

    it('should update list when items are modified', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;
      container.appendChild(listContainer);

      expect(listContainer.children[0].textContent).toBe('Item 1');

      // Modify item in array
      testItems[0].name = 'Modified Item 1';
      update();

      expect(listContainer.children[0].textContent).toBe('Modified Item 1');
    });

    it('should handle multiple lists independently', () => {
      const items1 = [{ id: 1, name: 'List1 Item1' }];
      const items2 = [{ id: 1, name: 'List2 Item1' }];

      const list1Fn = list(items1, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const list2Fn = list(items2, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const container1 = list1Fn(container as any, 0) as HTMLElement;
      const container2 = list2Fn(container as any, 0) as HTMLElement;

      container.appendChild(container1);
      container.appendChild(container2);

      expect(container1.children).toHaveLength(1);
      expect(container2.children).toHaveLength(1);

      // Modify only first list
      items1.push({ id: 2, name: 'List1 Item2' });
      update();

      expect(container1.children).toHaveLength(2);
      expect(container2.children).toHaveLength(1);
      expect(container1.children[1].textContent).toBe('List1 Item2');
    });

    it('should not throw when updating without any lists', () => {
      expect(() => update()).not.toThrow();
    });

    it('should clean up disconnected containers', () => {
      const listFn = list(testItems, (item) => {
        const div = document.createElement('div');
        div.textContent = item.name;
        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;
      container.appendChild(listContainer);

      expect(listContainer.children).toHaveLength(3);

      // Remove container from DOM
      container.removeChild(listContainer);

      // Should not throw and should handle cleanup
      testItems.push({ id: 4, name: 'Item 4' });
      expect(() => update()).not.toThrow();
    });
  });

  describe('render function types', () => {
    it('should handle render functions that return NodeModFn', () => {
      const listFn = list(testItems, (item) => {
        return (parent: any, index: number) => {
          const div = document.createElement('div');
          div.textContent = `${item.name} at ${index}`;
          return div;
        };
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;

      expect(listContainer.children).toHaveLength(3);
      expect(listContainer.children[0].textContent).toBe('Item 1 at 0');
    });

    it('should handle complex render functions', () => {
      const complexItems = [
        { id: 1, name: 'Task 1', completed: false },
        { id: 2, name: 'Task 2', completed: true }
      ];

      const listFn = list(complexItems, (item, index) => {
        const div = document.createElement('div');
        div.className = item.completed ? 'completed' : 'pending';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const statusSpan = document.createElement('span');
        statusSpan.textContent = item.completed ? ' ✓' : ' ○';

        div.appendChild(nameSpan);
        div.appendChild(statusSpan);

        return div as any;
      });

      const listContainer = listFn(container as any, 0) as HTMLElement;

      expect(listContainer.children).toHaveLength(2);
      expect(listContainer.children[0].className).toBe('pending');
      expect(listContainer.children[1].className).toBe('completed');
    });
  });
});