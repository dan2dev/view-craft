import { isFunction, isTagLike } from "../utility/typeGuards";
import { createMarkerPair, safeRemoveNode, getContainerParent } from "../utility/domMarkers";
import { arraysEqual, createMultiMap, addToMultiMap, takeFromMultiMap } from "../utility/arrayUtils";
import type { ListRenderer, ListRuntime, ListItemRecord, ListItemsProvider } from "./types";

const activeListRuntimes = new Set<ListRuntime<any>>();

function renderItem<TItem>(
  runtime: ListRuntime<TItem>,
  item: TItem,
  index: number,
): ExpandedElement<any> | null {
  const result = runtime.renderItem(item, index);

  if (isFunction(result)) {
    const element = (result as NodeModFn<any>)(runtime.host, index);
    if (element && isTagLike(element)) {
      return element as ExpandedElement<any>;
    }
    return null;
  }

  if (result && isTagLike(result)) {
    return result as ExpandedElement<any>;
  }

  return null;
}

function buildRecordsPool<TItem>(records: ListItemRecord<TItem>[]): Map<TItem, ListItemRecord<TItem>[]> {
  const pool = new Map<TItem, ListItemRecord<TItem>[]>();
  
  records.forEach((record) => {
    const items = pool.get(record.item);
    if (items) {
      items.push(record);
    } else {
      pool.set(record.item, [record]);
    }
  });
  
  return pool;
}

function remove(record: ListItemRecord<unknown>): void {
  const node = record.element as unknown as Node;
  safeRemoveNode(node);
}

export function sync<TItem>(runtime: ListRuntime<TItem>): void {
  const { host, startMarker, endMarker } = runtime;
  const parent = (startMarker.parentNode ?? (host as unknown as Node & ParentNode)) as Node & ParentNode;

  const currentItems = runtime.itemsProvider();

  if (arraysEqual(runtime.lastSyncedItems, currentItems)) {
    return;
  }

  // Build map of existing records by item reference for O(1) lookup
  // For duplicates, maintain order to preserve DOM element associations
  const existingRecordsMap = buildRecordsPool(runtime.records);

  const newRecords: Array<ListItemRecord<TItem>> = [];
  const elementsToRemove = new Set<ListItemRecord<TItem>>(runtime.records);
  let nextSibling: Node = endMarker;

  // Process items in reverse order to maintain correct positioning
  for (let i = currentItems.length - 1; i >= 0; i--) {
    const item = currentItems[i];
    let record: ListItemRecord<TItem> | null = null;

    // Try to find existing record for this item
    const existingRecords = existingRecordsMap.get(item);
    if (existingRecords && existingRecords.length > 0) {
      // For duplicates, take the first available to maintain DOM element order
      record = existingRecords.shift()!;
      if (existingRecords.length === 0) {
        existingRecordsMap.delete(item);
      }
    }

    if (record) {
      // Reuse existing element
      elementsToRemove.delete(record);
      record.item = item; // Update item reference
    } else {
      // Create new element
      const element = renderItem(runtime, item, i);
      if (!element) {
        continue;
      }
      record = { item, element };
    }

    newRecords.unshift(record);

    // Only move element if it's not already in the correct position
    const recordNode = record.element as unknown as Node;
    if (recordNode.nextSibling !== nextSibling) {
      parent.insertBefore(recordNode, nextSibling);
    }
    nextSibling = recordNode;
  }

  // Remove elements that are no longer needed
  elementsToRemove.forEach(remove);

  runtime.records = newRecords;
  runtime.lastSyncedItems = [...currentItems];
}

export function createListRuntime<TItem>(
  itemsProvider: ListItemsProvider<TItem>,
  renderItem: ListRenderer<TItem>,
  host: ExpandedElement<any>,
): ListRuntime<TItem> {
  const { start: startMarker, end: endMarker } = createMarkerPair("list");

  const runtime: ListRuntime<TItem> = {
    itemsProvider,
    renderItem,
    startMarker,
    endMarker,
    records: [],
    host,
    lastSyncedItems: [],
  };

  const parentNode = host as unknown as Node & ParentNode;
  parentNode.appendChild(startMarker);
  parentNode.appendChild(endMarker);

  activeListRuntimes.add(runtime);
  sync(runtime);

  return runtime;
}

export function updateListRuntimes(): void {
  activeListRuntimes.forEach((runtime) => {
    if (!runtime.startMarker.isConnected || !runtime.endMarker.isConnected) {
      activeListRuntimes.delete(runtime);
      return;
    }

    sync(runtime);
  });
}
