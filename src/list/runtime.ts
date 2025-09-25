import { isFunction, isTagLike } from "../utility/typeGuards";
import { createMarkerPair, safeRemoveChild } from "../utility/dom";
import { arraysEqual } from "../utility/arrayUtils";
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

function remove(record: ListItemRecord<unknown>): void {
  const node = record.element as unknown as Node;
  safeRemoveChild(node);
}

export function sync<TItem>(runtime: ListRuntime<TItem>): void {
  const { host, startMarker, endMarker } = runtime;
  const parent = (startMarker.parentNode ?? (host as unknown as Node & ParentNode)) as Node & ParentNode;

  const currentItems = runtime.itemsProvider();

  // Early exit if no changes - this prevents unnecessary DOM operations
  const areEqual = arraysEqual(runtime.lastSyncedItems, currentItems);
  if (areEqual) {
    return;
  }

  // Create mapping to track which record should be used for each position
  // This preserves DOM element identity for duplicate items
  const recordsByPosition = new Map<number, ListItemRecord<TItem>>();
  const availableRecords = new Map<TItem, ListItemRecord<TItem>[]>();
  
  // Group existing records by item for reuse
  runtime.records.forEach((record, index) => {
    const items = availableRecords.get(record.item);
    if (items) {
      items.push(record);
    } else {
      availableRecords.set(record.item, [record]);
    }
  });

  // Try to preserve existing element-to-position mappings for duplicates
  currentItems.forEach((item, newIndex) => {
    if (newIndex < runtime.lastSyncedItems.length && runtime.lastSyncedItems[newIndex] === item) {
      // Item hasn't moved - preserve its record
      const existingRecord = runtime.records[newIndex];
      if (existingRecord && existingRecord.item === item) {
        recordsByPosition.set(newIndex, existingRecord);
        const items = availableRecords.get(item);
        if (items) {
          const recordIndex = items.indexOf(existingRecord);
          if (recordIndex >= 0) {
            items.splice(recordIndex, 1);
            if (items.length === 0) {
              availableRecords.delete(item);
            }
          }
        }
      }
    }
  });

  const newRecords: Array<ListItemRecord<TItem>> = [];
  const elementsToRemove = new Set<ListItemRecord<TItem>>(runtime.records);
  let nextSibling: Node = endMarker;

  // Process items in reverse order to maintain correct positioning
  for (let i = currentItems.length - 1; i >= 0; i--) {
    const item = currentItems[i];
    let record = recordsByPosition.get(i);

    if (!record) {
      // Try to reuse available record for this item
      const availableItems = availableRecords.get(item);
      if (availableItems && availableItems.length > 0) {
        record = availableItems.shift()!;
        if (availableItems.length === 0) {
          availableRecords.delete(item);
        }
      }
    }

    if (record) {
      elementsToRemove.delete(record);
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
