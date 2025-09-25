import { updateListRuntimes } from "../list/runtime";
import { notifyReactiveElements, notifyReactiveTextNodes } from "./reactive";
import { updateWhenRuntimes } from "../when";
import { updateConditionalElements } from "./conditionalUpdater";
import { dispatchGlobalUpdateEvent } from "../utility/events";

/**
 * Updates all dynamic data sources, including registered reactive attributes, list renderers, and when blocks.
 */
export function update(): void {
  updateListRuntimes();
  updateWhenRuntimes();
  updateConditionalElements();
  notifyReactiveElements();
  notifyReactiveTextNodes();
  dispatchGlobalUpdateEvent();
}
