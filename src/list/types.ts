export type ListRenderer<TItem> = (
  item: TItem,
  index: number,
) => ExpandedElement<any> | NodeModFn<any>;

export type ListItemsProvider<TItem> = () => TItem[];

/**
 * Optional key extraction function for more efficient diffing / reordering.
 * Should return a stable, unique identifier for an item.
 */
export type ListKeyFn<TItem> = (item: TItem, index: number) => string | number;

/**
 * Future list() options bag. Additional tuning flags (e.g. reuseStrategy) can be added later.
 */
export interface ListOptions<TItem> {
  /**
   * Provide to enable keyed diff mode.
   */
  key?: ListKeyFn<TItem>;
}

/**
 * Single rendered list item record. Includes optional resolved key when keying is enabled.
 */
export interface ListItemRecord<TItem> {
  item: TItem;
  element: ExpandedElement<any>;
  key?: string | number;
}

/**
 * Runtime state for a list renderer. Key-related maps are populated only when a key function is supplied.
 */
export interface ListRuntime<TItem> {
  itemsProvider: ListItemsProvider<TItem>;
  renderItem: ListRenderer<TItem>;
  startMarker: Comment;
  endMarker: Comment;
  records: ListItemRecord<TItem>[];
  host: ExpandedElement<any>;
  lastSyncedItems: TItem[];
  /**
   * Optional key extraction function (undefined when unkeyed).
   */
  keyFn?: ListKeyFn<TItem>;
  /**
   * Lookup from key to the most recent record (only in keyed mode).
   */
  keyIndex?: Map<string | number, ListItemRecord<TItem>>;
}
