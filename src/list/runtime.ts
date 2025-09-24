import { isFunction, isTagLike } from "../utility/typeGuards";
import type { ListRenderer, ListRuntime, ListItemRecord } from "./types";

const activeListRuntimes = new Set<ListRuntime<any>>();

function renderListItem<TItem>(
  runtime: ListRuntime<TItem>,
  item: TItem,
  index: number,
): ExpandedElement<any> | null {
  const candidate = runtime.renderItem(item, index);

  if (isFunction(candidate)) {
    const evaluated = (candidate as NodeModFn<any>)(runtime.host, index);
    if (evaluated && isTagLike(evaluated)) {
      return evaluated as ExpandedElement<any>;
    }
    return null;
  }

  if (candidate && isTagLike(candidate)) {
    return candidate as ExpandedElement<any>;
  }

  return null;
}

function buildRecordPool<TItem>(records: ListItemRecord<TItem>[]): Map<TItem, ListItemRecord<TItem>[]> {
  const pool = new Map<TItem, ListItemRecord<TItem>[]>();

  records.forEach((record) => {
    const bucket = pool.get(record.item);
    if (bucket) {
      bucket.push(record);
    } else {
      pool.set(record.item, [record]);
    }
  });

  return pool;
}

function takeRecordFromPool<TItem>(
  pool: Map<TItem, ListItemRecord<TItem>[]>,
  item: TItem,
): ListItemRecord<TItem> | null {
  const bucket = pool.get(item);
  if (!bucket || bucket.length === 0) {
    return null;
  }

  const record = bucket.shift()!;
  if (bucket.length === 0) {
    pool.delete(item);
  }

  return record;
}

function removeRecord(record: ListItemRecord<unknown>): void {
  const node = record.element as unknown as Node;
  node.parentNode?.removeChild(node);
}

export function synchronizeRuntime<TItem>(runtime: ListRuntime<TItem>): void {
  const { host, startMarker, endMarker } = runtime;
  const parentNode = (startMarker.parentNode ?? (host as unknown as Node & ParentNode)) as Node & ParentNode;

  const recordPool = buildRecordPool(runtime.records);
  const nextRecords: Array<ListItemRecord<TItem>> = [];

  runtime.items.forEach((item, index) => {
    let record = takeRecordFromPool(recordPool, item);

    if (!record) {
      const element = renderListItem(runtime, item, index);
      if (!element) {
        return;
      }
      record = { item, element };
    } else {
      record.item = item;
    }

    nextRecords.push(record);
    parentNode.insertBefore(record.element as unknown as Node, endMarker);
  });

  recordPool.forEach((records) => records.forEach(removeRecord));

  runtime.records = nextRecords;
}

export function createListRuntime<TItem>(
  items: TItem[],
  renderItem: ListRenderer<TItem>,
  host: ExpandedElement<any>,
): ListRuntime<TItem> {
  const startMarker = document.createComment(`list-start-${Math.random().toString(36).slice(2)}`);
  const endMarker = document.createComment("list-end");

  const runtime: ListRuntime<TItem> = {
    items,
    renderItem,
    startMarker,
    endMarker,
    records: [],
    host,
  };

  const parentNode = host as unknown as Node & ParentNode;
  parentNode.appendChild(startMarker);
  parentNode.appendChild(endMarker);

  activeListRuntimes.add(runtime);
  synchronizeRuntime(runtime);

  return runtime;
}

export function updateListRuntimes(): void {
  activeListRuntimes.forEach((runtime) => {
    if (!runtime.startMarker.isConnected || !runtime.endMarker.isConnected) {
      activeListRuntimes.delete(runtime);
      return;
    }

    synchronizeRuntime(runtime);
  });
}
