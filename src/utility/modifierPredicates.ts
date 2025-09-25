import { isFunction, isNode, isObject } from "./typeGuards";

/**
 * Any modifier type
 */
type AnyModifier = unknown;

/**
 * Boolean condition function type
 */
type BooleanCondition = () => boolean;

/**
 * Cache to store the first evaluation result of zero-arg modifier probes.
 * This prevents double execution of side-effect functions during:
 *  - Conditional detection (probing to see if a modifier returns boolean)
 *  - Actual modifier application (reactive text detection)
 *
 * We only probe (execute) a zero-arg function once; subsequent consumers
 * (like applyNodeModifier) can reuse the cached value (once that file
 * adopts the cache) to avoid running user code twice.
 */
const modifierProbeCache = new WeakMap<Function, { value: unknown; error: boolean }>();

function probeOnce(fn: Function): { value: unknown; error: boolean } {
  const cached = modifierProbeCache.get(fn);
  if (cached) {
    return cached;
  }
  try {
    const value = fn();
    const record = { value, error: false };
    modifierProbeCache.set(fn, record);
    return record;
  } catch {
    const record = { value: undefined, error: true };
    modifierProbeCache.set(fn, record);
    return record;
  }
}

/**
 * Determines if a function is a boolean-returning condition without
 * executing it more than once (leverages probe cache).
 */
function isBooleanFunction(fn: Function): fn is BooleanCondition {
  const { value, error } = probeOnce(fn);
  if (error) {
    return false;
  }
  return typeof value === "boolean";
}

/**
 * Determines whether a modifier should be treated as a conditional modifier.
 */
export function isConditionalModifier(
  modifier: AnyModifier,
  allModifiers: AnyModifier[],
  currentIndex: number
): modifier is BooleanCondition {
  if (!isFunction(modifier) || (modifier as Function).length !== 0 || !isBooleanFunction(modifier as Function)) {
    return false;
  }

  const otherModifiers = allModifiers.filter((_, index) => index !== currentIndex);
  if (otherModifiers.length === 0) {
    return false;
  }

  const hasAttributesOrElements = otherModifiers.some(
    (mod) =>
      isObject(mod) ||
      isNode(mod) ||
      (isFunction(mod) && (mod as Function).length > 0)
  );

  return hasAttributesOrElements;
}

/**
 * Finds the index of the first conditional modifier in a modifiers array.
 */
export function findConditionalModifier(modifiers: AnyModifier[]): number {
  for (let i = 0; i < modifiers.length; i += 1) {
    if (isConditionalModifier(modifiers[i], modifiers, i)) {
      return i;
    }
  }
  return -1;
}

/**
 * Export the probe cache so other systems (e.g., applyNodeModifier) can
 * reuse the first-evaluated value instead of executing again.
 */
export { modifierProbeCache };
