import { isFunction, isNode, isObject } from "./typeGuards";

type AnyModifier = unknown;

type BooleanCondition = () => boolean;

function isBooleanFunction(fn: Function): fn is BooleanCondition {
  try {
    return typeof fn() === "boolean";
  } catch {
    return false;
  }
}

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

  const hasAttributesOrElements = otherModifiers.some((mod) =>
    isObject(mod) || isNode(mod) || (isFunction(mod) && (mod as Function).length > 0)
  );

  return hasAttributesOrElements;
}

export function findConditionalModifier(modifiers: AnyModifier[]): number {
  for (let i = 0; i < modifiers.length; i += 1) {
    if (isConditionalModifier(modifiers[i], modifiers, i)) {
      return i;
    }
  }
  return -1;
}
