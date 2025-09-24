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
});