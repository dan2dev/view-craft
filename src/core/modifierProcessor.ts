import { applyAttributes } from "./attributeManager";
import { createReactiveTextNode } from "./reactive";
import { logError } from "../utility/errorHandler";
import { isFunction, isNode, isObject, isPrimitive } from "../utility/typeGuards";
import { modifierProbeCache } from "../utility/modifierPredicates";
export { isConditionalModifier, findConditionalModifier } from "../utility/modifierPredicates";

export type NodeModifier<TTagName extends ElementTagName = ElementTagName> =
  | NodeMod<TTagName>
  | NodeModFn<TTagName>;

export function applyNodeModifier<TTagName extends ElementTagName>(
  parent: ExpandedElement<TTagName>,
  modifier: NodeModifier<TTagName>,
  index: number,
): Node | null {
  if (modifier == null) return null;

  if (isFunction(modifier)) {
    if (modifier.length === 0) {
      try {
        let record = modifierProbeCache.get(modifier as Function);
        if (!record) {
          const value = (modifier as () => unknown)();
          record = { value, error: false };
          modifierProbeCache.set(modifier as Function, record);
        }
        if (record.error) {
          return createReactiveTextNode(() => "");
        }
        const v = record.value;
        return isPrimitive(v) && v != null
          ? createReactiveTextNode(modifier as () => Primitive, v)
          : null;
      } catch (error) {
        modifierProbeCache.set(modifier as Function, { value: undefined, error: true });
        logError("Error evaluating reactive text function:", error);
        return createReactiveTextNode(() => "");
      }
    }

    const produced = (modifier as NodeModFn<TTagName>)(parent, index);
    if (produced == null) return null;
    if (isPrimitive(produced)) return document.createTextNode(String(produced));
    if (isNode(produced)) return produced;
    if (isObject(produced)) {
      applyAttributes(parent, produced as ExpandedElementAttributes<TTagName>);
    }
    return null;
  }

  const candidate = modifier as NodeMod<TTagName>;
  if (candidate == null) return null;
  if (isPrimitive(candidate)) return document.createTextNode(String(candidate));
  if (isNode(candidate)) return candidate;
  if (isObject(candidate)) {
    applyAttributes(parent, candidate as ExpandedElementAttributes<TTagName>);
  }
  return null;
}
