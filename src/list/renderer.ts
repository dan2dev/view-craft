import { createListRuntime } from "./runtime";
import type { ListRenderer } from "./types";

/**
 * Creates a comment-delimited list renderer that keeps DOM nodes in sync with the provided items.
 */
export function createDynamicListRenderer<TItem>(
  items: TItem[],
  renderItem: ListRenderer<TItem>,
): NodeModFn<any> {
  return (host: ExpandedElement<any>) => {
    const runtime = createListRuntime(items, renderItem, host);
    return runtime.startMarker;
  };
}
