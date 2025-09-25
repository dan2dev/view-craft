import { createMarkerPair, safeRemoveChild } from "../utility/dom";
import { arraysEqual } from "../utility/arrayUtils";
import { resolveRenderable } from "../utility/renderables";
import type {
  ListRenderer,
  ListRuntime,
  ListItemRecord,
  ListItemsProvider,
  ListOptions
} from "./types";

const activeListRuntimes = new Set<ListRuntime<any>>();

function renderItem<TItem>(
  runtime: ListRuntime<TItem>,
  item: TItem,
  index: number,
): ExpandedElement<any> | null {
  const result = runtime.renderItem(item, index);
  return resolveRenderable(result, runtime.host, index);
}

function remove(record: ListItemRecord<unknown>): void {
  const node = record.element as unknown as Node;
  safeRemoveChild(node);
}

/**
 * Keyed diff path for lists with a key function.
 * Supports reordering, insertion, and deletion with minimal DOM movement.
 */
function syncKeyed<TItem>(
  runtime: ListRuntime<TItem>,
  currentItems: TItem[],
  parent: Node & ParentNode
): void {
  const { endMarker, keyFn } = runtime;
  if (!keyFn) return;

  // Map existing records by key
  const existingByKey = new Map<string | number, ListItemRecord<TItem>>();
  runtime.records.forEach(r => {
    if (r.key !== undefined) existingByKey.set(r.key, r);
  });

  const newRecords: ListItemRecord<TItem>[] = [];
  for (let i = 0; i < currentItems.length; i++) {
    const item = currentItems[i];
    const key = keyFn(item, i);
    let record = existingByKey.get(key);
    if (record) {
      // Update item reference, preserve element
      record.item = item;
      existingByKey.delete(key);
    } else {
      const element = renderItem(runtime, item, i);
      if (!element) continue;
      record = { item, element, key };
    }
    newRecords.push(record);
  }

  // Remove records not reused
  existingByKey.forEach(r => remove(r));

  // Reorder DOM to match new order (stable append relative to endMarker)
  let nextSibling: Node = endMarker;
  for (let i = newRecords.length - 1; i >= 0; i--) {
    const node = newRecords[i].element as unknown as Node;
    if (node.nextSibling !== nextSibling) {
      parent.insertBefore(node, nextSibling);
    }
    nextSibling = node;
  }

  runtime.records = newRecords;
  runtime.lastSyncedItems = [...currentItems];
  runtime.keyIndex = new Map(newRecords.map(r => [r.key!, r]));
}

export function sync<TItem>(runtime: ListRuntime<TItem>): void {
  const { host, startMarker, endMarker, keyFn } = runtime;
  const parent = (startMarker.parentNode ?? (host as unknown as Node & ParentNode)) as Node & ParentNode;

  const currentItems = runtime.itemsProvider();

  if (keyFn) {
    // Always run keyed diff (array reference equality is not sufficient for reorder detection)
    syncKeyed(runtime, currentItems, parent);
    return;
  }

  // Unkeyed fast path: bail if arrays are strictly identical by content & order
  if (arraysEqual(runtime.lastSyncedItems, currentItems)) {
    return;
  }

  // Create mapping to track which record should be used for each position
  const recordsByPosition = new Map<number, ListItemRecord<TItem>>();
  const availableRecords = new Map<TItem, ListItemRecord<TItem>[]>();
  
  // Group existing records by item for reuse
  runtime.records.forEach((record) => {
    const items = availableRecords.get(record.item);
    if (items) {
      items.push(record);
    } else {
      availableRecords.set(record.item, [record]);
    }
  });

  // Preserve existing position for unchanged items
  currentItems.forEach((item, newIndex) => {
    if (newIndex < runtime.lastSyncedItems.length && runtime.lastSyncedItems[newIndex] === item) {
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

  for (let i = currentItems.length - 1; i >= 0; i--) {
    const item = currentItems[i];
    let record = recordsByPosition.get(i);

    if (!record) {
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
      const element = renderItem(runtime, item, i);
      if (!element) continue;
      record = { item, element };
    }

    newRecords.unshift(record);

    const recordNode = record.element as unknown as Node;
    if (recordNode.nextSibling !== nextSibling) {
      parent.insertBefore(recordNode, nextSibling);
    }
    nextSibling = recordNode;
  }

  elementsToRemove.forEach(remove);

  runtime.records = newRecords;
  runtime.lastSyncedItems = [...currentItems];
}

export function createListRuntime<TItem>(
  itemsProvider: ListItemsProvider<TItem>,
  renderItem: ListRenderer<TItem>,
  host: ExpandedElement<any>,
  options?: ListOptions<TItem>
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
    keyFn: options?.key,
    keyIndex: options?.key ? new Map() : undefined
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
