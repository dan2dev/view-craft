import { applyAttributes } from "./attributeManager";
import { createReactiveTextNode } from "./reactive";
import { logError } from "../utility/errorHandler";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";
import { modifierProbeCache } from "../utility/modifierPredicates";
import { createText, setHydrationParent } from "../utility/nodeFactory";
import { isHydrating } from "../utility/runtimeContext";
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
        if (isPrimitive(v) && v != null) {
          // During hydration, try to claim existing text node
          let existingTextNode: Text | undefined;
          if (isHydrating()) {
            setHydrationParent(parent as Node);
            const claimed = createText(String(v), parent as Node);
            if (claimed && claimed.nodeType === Node.TEXT_NODE) {
              existingTextNode = claimed as Text;
            }
          }
          return createReactiveTextNode(modifier as () => Primitive, v, existingTextNode);
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
    if (isPrimitive(produced)) {
      if (isHydrating()) {
        setHydrationParent(parent as Node);
      }
      return createText(String(produced), parent as Node);
    }
    if (isNode(produced)) return produced;
    if (isObject(produced)) applyAttributes(parent, produced as ExpandedElementAttributes<TTagName>);
    return null;
  }

  // Plain value / node / attributes object
  const candidate = modifier as NodeMod<TTagName>;
  if (candidate == null) return null;
  if (isPrimitive(candidate)) {
    if (isHydrating()) {
      setHydrationParent(parent as Node);
    }
    return createText(String(candidate), parent as Node);
  }
  if (isNode(candidate)) return candidate;
  if (isObject(candidate)) applyAttributes(parent, candidate as ExpandedElementAttributes<TTagName>);
  return null;
}
