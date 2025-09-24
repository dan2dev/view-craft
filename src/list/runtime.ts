import { isFunction, isTagLike } from "../utility/typeGuards";
import type { ListRenderer, ListRuntime, ListItemRecord, ListItemsProvider } from "./types";

function arraysEqual<T>(a: T[], b: T[]): boolean {
  // Quick reference check first
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

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

function buildPool<TItem>(records: ListItemRecord<TItem>[]): Map<TItem, ListItemRecord<TItem>[]> {
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

function takeFromPool<TItem>(
  pool: Map<TItem, ListItemRecord<TItem>[]>,
  item: TItem,
): ListItemRecord<TItem> | null {
  const items = pool.get(item);
  if (!items || items.length === 0) {
    return null;
  }

  const record = items.shift()!;
  if (items.length === 0) {
    pool.delete(item);
  }

  return record;
}

function remove(record: ListItemRecord<unknown>): void {
  const node = record.element as unknown as Node;
  node.parentNode?.removeChild(node);
}

export function sync<TItem>(runtime: ListRuntime<TItem>): void {
  const { host, startMarker, endMarker } = runtime;
  const parent = (startMarker.parentNode ?? (host as unknown as Node & ParentNode)) as Node & ParentNode;

  const currentItems = runtime.itemsProvider();

  if (arraysEqual(runtime.lastSyncedItems, currentItems)) {
    return;
  }

  const pool = buildPool(runtime.records);
  const newRecords: Array<ListItemRecord<TItem>> = [];

  currentItems.forEach((item, index) => {
    let record = takeFromPool(pool, item);

    if (!record) {
      const element = renderItem(runtime, item, index);
      if (!element) {
        return;
      }
      record = { item, element };
    } else {
      record.item = item;
    }

    newRecords.push(record);
    parent.insertBefore(record.element as unknown as Node, endMarker);
  });

  pool.forEach((records) => records.forEach(remove));

  runtime.records = newRecords;
  runtime.lastSyncedItems = [...currentItems];
}

export function createListRuntime<TItem>(
  itemsProvider: ListItemsProvider<TItem>,
  renderItem: ListRenderer<TItem>,
  host: ExpandedElement<any>,
): ListRuntime<TItem> {
  const startMarker = document.createComment(`list-start-${Math.random().toString(36).slice(2)}`);
  const endMarker = document.createComment("list-end");

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
