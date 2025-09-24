import { isFunction } from "../utility/typeGuards";
import { registerAttributeResolver, createReactiveTextNode } from "./reactive";
import { applyStyleAttribute } from "./styleManager";

type AttributeKey<TTagName extends ElementTagName> = keyof ExpandedElementAttributes<TTagName>;
type AttributeCandidate<TTagName extends ElementTagName> =
  ExpandedElementAttributes<TTagName>[AttributeKey<TTagName>];

type AttributeValue = string | number | boolean;

function isZeroArgFunction(value: unknown): value is () => unknown {
  return isFunction(value) && value.length === 0;
}

function assignDirectValue<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: AttributeKey<TTagName>,
  value: AttributeValue | null | undefined,
): void {
  if (value == null) {
    return;
  }

  if (key in element) {
    (element as Record<string, unknown>)[key as string] = value;
    return;
  }

  if (element instanceof Element) {
    element.setAttribute(String(key), String(value));
  }
}

function applyAttributeCandidate<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: AttributeKey<TTagName>,
  candidate: AttributeCandidate<TTagName>,
): void {
  if (candidate == null) {
    return;
  }

  if (key === "style") {
    applyStyleAttribute(element, candidate as ExpandedElementAttributes<TTagName>["style"]);
    return;
  }

  if (isZeroArgFunction(candidate)) {
    registerAttributeResolver(
      element,
      key,
      candidate as () => unknown,
      (value) => assignDirectValue(element, key, value as AttributeValue)
    );
    return;
  }

  assignDirectValue(element, key, candidate as AttributeValue);
}

/**
 * Applies attribute candidates to the provided element, wiring up reactive values when necessary.
 */
export function applyAttributes<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  attributes: ExpandedElementAttributes<TTagName>,
): void {
  for (const key in attributes) {
    if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
      continue;
    }

    const typedKey = key as AttributeKey<TTagName>;
    const candidate = attributes[typedKey] as AttributeCandidate<TTagName> | undefined;
    if (candidate == null) {
      continue;
    }

    applyAttributeCandidate(element, typedKey, candidate as AttributeCandidate<TTagName>);
  }
}

export { createReactiveTextNode } from "./reactive";
