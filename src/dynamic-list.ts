type ListRenderFunction<T> = (item: T, index: number) => ExpandedElement<any> | NodeModFn<any>;

interface ListItemRecord<T> {
  item: T;
  element: ExpandedElement<any>;
}

interface ListInfo<T> {
  items: T[];
  renderFn: ListRenderFunction<T>;
  startMarker: Comment;
  endMarker: Comment;
  records: ListItemRecord<T>[];
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
    const startMarker = document.createComment(`list-start-${Math.random().toString(36).substr(2, 9)}`);
    const endMarker = document.createComment("list-end");

    const listInfo: ListInfo<T> = {
      items,
      renderFn,
      startMarker,
      endMarker,
      records: [],
      parent
    };

    listInfoMap.set(items, listInfo);
    activeLists.add(listInfo);

    parent.appendChild(startMarker);
    parent.appendChild(endMarker);

    syncListWithItems(listInfo);

    return startMarker;
  };
}

/**
 * Updates all dynamic lists that reference arrays that have been modified
 */
export function update(): void {
  activeLists.forEach(listInfo => {
    if (listInfo.startMarker.isConnected && listInfo.endMarker.isConnected) {
      syncListWithItems(listInfo);
    } else {
      activeLists.delete(listInfo);
      listInfoMap.delete(listInfo.items);
    }
  });
}

function syncListWithItems<T>(listInfo: ListInfo<T>): void {
  const parentNode = listInfo.startMarker.parentNode;
  if (!parentNode) return;

  const recordPool = buildRecordPool(listInfo.records);
  const nextRecords: ListItemRecord<T>[] = [];

  listInfo.items.forEach((item, index) => {
    let record = takeRecordFromPool(recordPool, item);

    if (!record) {
      const element = createElementForItem(listInfo, item, index);
      if (!element) {
        return;
      }
      record = { item, element };
    } else {
      record.item = item;
    }

    nextRecords.push(record);
    parentNode.insertBefore(record.element as unknown as Node, listInfo.endMarker);
  });

  recordPool.forEach((records) => {
    records.forEach(removeRecord);
  });

  listInfo.records = nextRecords;
}

function createElementForItem<T>(listInfo: ListInfo<T>, item: T, index: number): ExpandedElement<any> | null {
  const renderedElement = listInfo.renderFn(item, index);

  if (typeof renderedElement === "function") {
    const result = (renderedElement as NodeModFn<any>)(listInfo.parent, index);
    if (result && typeof result === "object" && "tagName" in result) {
      return result as ExpandedElement<any>;
    }
    return null;
  }

  if (renderedElement && typeof renderedElement === "object" && "tagName" in renderedElement) {
    return renderedElement;
  }

  return null;
}

function buildRecordPool<T>(records: ListItemRecord<T>[]): Map<T, ListItemRecord<T>[]> {
  const pool = new Map<T, ListItemRecord<T>[]>();

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

function takeRecordFromPool<T>(
  pool: Map<T, ListItemRecord<T>[]>,
  item: T
): ListItemRecord<T> | undefined {
  const bucket = pool.get(item);
  if (!bucket || bucket.length === 0) {
    return undefined;
  }

  const record = bucket.shift()!;
  if (bucket.length === 0) {
    pool.delete(item);
  }

  return record;
}

function removeRecord<T>(record: ListItemRecord<T>): void {
  const node = record.element as unknown as Node;
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
