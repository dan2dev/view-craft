import { applyAttributes } from "./attributeManager";
import { createReactiveTextNode, createReactiveNodeModFn } from "./reactive";
import { logError } from "../utility/errorHandler";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";
import { modifierProbeCache } from "../utility/modifierPredicates";
export { isConditionalModifier, findConditionalModifier } from "../utility/modifierPredicates";

/**
 * Unified alias for any node modifier (function or direct value/object).
 * Exported so downstream helpers can standardize on a single name.
 */
export type NodeModifier<TTagName extends ElementTagName = ElementTagName> =
  | NodeMod<TTagName>
  | NodeModFn<TTagName>;

/**
 * Applies a modifier to the parent element and returns any rendered node.
 * Handles:
 *  - zero-arg functions (reactive text producers)
 *  - NodeModFn (function with (parent,index))
 *  - primitives (converted to text nodes)
 *  - Node instances (returned directly)
 *  - attribute objects (applied, no node returned)
 */
export function applyNodeModifier<TTagName extends ElementTagName>(
  parent: ExpandedElement<TTagName>,
  modifier: NodeModifier<TTagName>,
  index: number,
): Node | null {
  if (modifier == null) return null;

  if (isFunction(modifier)) {
    // Zero-arg reactive/value function
    if (modifier.length === 0) {
      try {
        let record = modifierProbeCache.get(modifier as Function);
        if (!record) {
          const value = (modifier as () => unknown)();
          record = { value, error: false };
          modifierProbeCache.set(modifier as Function, record);
        }
        if (record.error) return createReactiveTextNode(() => "");
        const v = record.value;
        
        // Handle reactive text (primitives)
        if (isPrimitive(v) && v != null) {
          return createReactiveTextNode(modifier as () => Primitive, v);
        }
        
        // Handle reactive NodeModFn (like () => cn("classes"))
        if (isFunction(v)) {
          // NodeModFn typically has length >= 1 (parent, index parameters)
          // Create a reactive wrapper that re-invokes the NodeModFn on updates
          return createReactiveNodeModFn(modifier as () => NodeModFn<TTagName>, parent, index);
        }
        
        return null;
      } catch (error) {
        modifierProbeCache.set(modifier as Function, { value: undefined, error: true });
        logError("Error evaluating reactive text function:", error);
        return createReactiveTextNode(() => "");
      }
    }
    // Non-zero-arg NodeModFn
    const produced = (modifier as NodeModFn<TTagName>)(parent, index);
    if (produced == null) return null;
    if (isPrimitive(produced)) return document.createTextNode(String(produced));
    if (isNode(produced)) return produced;
    if (isObject(produced)) applyAttributes(parent, produced as ExpandedElementAttributes<TTagName>);
    return null;
  }

  // Plain value / node / attributes object
  const candidate = modifier as NodeMod<TTagName>;
  if (candidate == null) return null;
  if (isPrimitive(candidate)) return document.createTextNode(String(candidate));
  if (isNode(candidate)) return candidate;
  if (isObject(candidate)) applyAttributes(parent, candidate as ExpandedElementAttributes<TTagName>);
  return null;
}
