import { createListRuntime } from "./runtime";
import type { ListRenderer, ListItemsProvider, ListOptions } from "./types";

/**
 * Maps items to DOM elements, keeping them in sync with changes.
 */
export function list<TItem>(
  itemsProvider: ListItemsProvider<TItem>,
  render: ListRenderer<TItem>
): NodeModFn<any>;
export function list<TItem>(
  itemsProvider: ListItemsProvider<TItem>,
  render: ListRenderer<TItem>,
  options: ListOptions<TItem>
): NodeModFn<any>;
export function list<TItem>(
  itemsProvider: ListItemsProvider<TItem>,
  render: ListRenderer<TItem>,
  options?: ListOptions<TItem>
): NodeModFn<any> {
  // Pass options (e.g., key function) through to runtime so keyed diffing can engage
  return (host: ExpandedElement<any>) => {
    const runtime = createListRuntime(itemsProvider, render, host, options);
    return runtime.startMarker;
  };
}
