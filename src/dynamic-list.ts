type ListRenderFunction<T> = (item: T, index: number) => ExpandedElement<any> | NodeModFn<any>;

// WeakMap to track original arrays and their corresponding list containers
const listContainerMap = new WeakMap<any[], ExpandedElement<any>>();
const listRenderFunctionMap = new WeakMap<any[], ListRenderFunction<any>>();
const listItemsMap = new WeakMap<ExpandedElement<any>, ExpandedElement<any>[]>();

/**
 * Creates a dynamic list that can be updated when the original array changes
 * @param items The original array to render
 * @param renderFn Function to render each item
 * @returns A DOM element containing the rendered list
 */
export function list<T>(
  items: T[],
  renderFn: ListRenderFunction<T>
): NodeModFn<any> {
  return (parent: ExpandedElement<any>, index: number) => {
    // Create container element for the list
    const container = document.createElement('div') as ExpandedElement<any>;
    container.setAttribute('data-dynamic-list', 'true');

    // Store references in WeakMaps
    listContainerMap.set(items, container);
    listRenderFunctionMap.set(items, renderFn);

    // Initial render
    updateListContainer(items);

    return container;
  };
}

/**
 * Updates all dynamic lists that reference arrays that have been modified
 */
export function update(): void {
  // Find all containers that need updates by checking their stored arrays
  const containersToUpdate = new Set<ExpandedElement<any>>();

  // Since we can't iterate over WeakMaps directly, we need to track containers differently
  // We'll use a global registry of active list containers
  activeListContainers.forEach(container => {
    if (container.isConnected) {
      containersToUpdate.add(container);
    } else {
      // Clean up disconnected containers
      activeListContainers.delete(container);
    }
  });

  containersToUpdate.forEach(container => {
    const items = getItemsForContainer(container);
    if (items) {
      updateListContainer(items);
    }
  });
}

// Global registry to track active list containers
const activeListContainers = new Set<ExpandedElement<any>>();
const containerToItemsMap = new WeakMap<ExpandedElement<any>, any[]>();

/**
 * Updates a specific list container with current array data
 */
function updateListContainer<T>(items: T[]): void {
  const container = listContainerMap.get(items);
  const renderFn = listRenderFunctionMap.get(items);

  if (!container || !renderFn) {
    return;
  }

  // Clear existing items
  const existingItems = listItemsMap.get(container) || [];
  existingItems.forEach(item => {
    if (item.parentNode) {
      item.parentNode.removeChild(item);
    }
  });

  // Render new items
  const newItems: ExpandedElement<any>[] = [];

  items.forEach((item, index) => {
    const renderedElement = renderFn(item, index);

    // If renderFn returns a function (NodeModFn), execute it
    let element: ExpandedElement<any>;
    if (typeof renderedElement === 'function') {
      const result = (renderedElement as NodeModFn<any>)(container, index);
      if (result && typeof result === 'object' && 'tagName' in result) {
        element = result as ExpandedElement<any>;
      } else {
        // Skip if the function doesn't return a valid element
        return;
      }
    } else {
      element = renderedElement;
    }

    if (element && element.tagName) {
      container.appendChild(element as unknown as Node);
      newItems.push(element);
    }
  });

  // Update tracking
  listItemsMap.set(container, newItems);
  activeListContainers.add(container);
  containerToItemsMap.set(container, items);
}

/**
 * Helper function to get items array for a container
 */
function getItemsForContainer(container: ExpandedElement<any>): any[] | undefined {
  return containerToItemsMap.get(container);
}