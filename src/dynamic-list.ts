type ListRenderFunction<T> = (item: T, index: number) => ExpandedElement<any> | NodeModFn<any>;

// Data structures for tracking lists using comment markers
interface ListInfo<T> {
  items: T[];
  renderFn: ListRenderFunction<T>;
  startMarker: Comment;
  endMarker: Comment;
  renderedElements: Map<T, ExpandedElement<any>>; // Maps items to their DOM elements
  parent: ExpandedElement<any>;
}

// WeakMap to track original arrays and their list info
const listInfoMap = new WeakMap<any[], ListInfo<any>>();
// Set to track all active lists for updates
const activeLists = new Set<ListInfo<any>>();

/**
 * Creates a dynamic list that renders inline using comment markers
 * @param items The original array to render
 * @param renderFn Function to render each item
 * @returns A modifier function that inserts comment markers and initial elements
 */
export function list<T>(
  items: T[],
  renderFn: ListRenderFunction<T>
): NodeModFn<any> {
  return (parent: ExpandedElement<any>, index: number) => {
    // Create comment markers to define list boundaries
    const startMarker = document.createComment(`list-start-${Math.random().toString(36).substr(2, 9)}`);
    const endMarker = document.createComment('list-end');

    // Create list info object
    const listInfo: ListInfo<T> = {
      items,
      renderFn,
      startMarker,
      endMarker,
      renderedElements: new Map(),
      parent
    };

    // Store in tracking maps
    listInfoMap.set(items, listInfo);
    activeLists.add(listInfo);

    // Insert start marker
    parent.appendChild(startMarker);

    // Insert end marker
    parent.appendChild(endMarker);

    // Render initial items (this will insert them between the markers)
    renderListItems(listInfo);

    // Insert the initial elements between markers
    listInfo.items.forEach((item) => {
      const element = listInfo.renderedElements.get(item);
      if (element && element.tagName) {
        // Always insert before the end marker to maintain order
        parent.insertBefore(element as unknown as Node, endMarker);
      }
    });

    // Return the start marker (for positioning reference)
    return startMarker;
  };
}

/**
 * Updates all dynamic lists that reference arrays that have been modified
 */
export function update(): void {
  // Update all active lists
  activeLists.forEach(listInfo => {
    if (listInfo.startMarker.isConnected && listInfo.endMarker.isConnected) {
      updateList(listInfo);
    } else {
      // Clean up disconnected lists
      activeLists.delete(listInfo);
    }
  });
}

/**
 * Renders or updates the items for a specific list
 */
function renderListItems<T>(listInfo: ListInfo<T>): void {
  const { items, renderFn, startMarker, endMarker, parent } = listInfo;
  const newRenderedElements = new Map<T, ExpandedElement<any>>();

  items.forEach((item, index) => {
    let element: ExpandedElement<any>;

    // Check if we already have a rendered element for this item
    if (listInfo.renderedElements.has(item)) {
      element = listInfo.renderedElements.get(item)!;
    } else {
      // Create new element
      const renderedElement = renderFn(item, index);

      if (typeof renderedElement === 'function') {
        const result = (renderedElement as NodeModFn<any>)(parent, index);
        if (result && typeof result === 'object' && 'tagName' in result) {
          element = result as ExpandedElement<any>;
        } else {
          return; // Skip invalid elements
        }
      } else {
        element = renderedElement;
      }
    }

    if (element && element.tagName) {
      newRenderedElements.set(item, element);
    }
  });

  listInfo.renderedElements = newRenderedElements;
}

/**
 * Updates a specific list by reordering/adding/removing DOM elements
 */
function updateList<T>(listInfo: ListInfo<T>): void {
  const { items, startMarker, endMarker } = listInfo;

  // First, clean up any elements that are no longer in the items array
  const itemsSet = new Set(items);
  listInfo.renderedElements.forEach((element, item) => {
    if (!itemsSet.has(item)) {
      // Remove from DOM if it's still there
      if (element.parentNode) {
        element.parentNode.removeChild(element as unknown as Node);
      }
      // Remove from our tracking
      listInfo.renderedElements.delete(item);
    }
  });

  // Re-render to ensure we have all elements for current items
  renderListItems(listInfo);

  // Remove only our list elements from DOM (preserve other siblings)
  listInfo.renderedElements.forEach((element) => {
    if (element.parentNode) {
      element.parentNode.removeChild(element as unknown as Node);
    }
  });

  // Insert elements in the new order between markers
  const parent = startMarker.parentNode!;

  items.forEach((item) => {
    const element = listInfo.renderedElements.get(item);
    if (element && element.tagName) {
      // Always insert before the end marker to maintain order and preserve siblings
      parent.insertBefore(element as unknown as Node, endMarker);
    }
  });
}