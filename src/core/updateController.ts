import { updateListRuntimes } from "../list/runtime";
import { notifyReactiveElements, notifyReactiveTextNodes } from "./attributeManager";
import { updateWhenRuntimes } from "../when";

function dispatchGlobalUpdateEvent(): void {
  if (typeof document === "undefined") {
    return;
  }

  const targets: EventTarget[] = [];
  if (document.body) {
    targets.push(document.body);
  }
  targets.push(document);

  targets.forEach((target) => {
    try {
      target.dispatchEvent(new Event("update", { bubbles: true }));
    } catch (error) {
      console.error("Error dispatching global update event:", error);
    }
  });
}

/**
 * Updates all dynamic data sources, including registered reactive attributes, list renderers, and when blocks.
 */
export function update(): void {
  updateListRuntimes();
  updateWhenRuntimes();
  notifyReactiveElements();
  notifyReactiveTextNodes();
  dispatchGlobalUpdateEvent();
}
