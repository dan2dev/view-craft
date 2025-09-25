/**
 * Determines whether the provided value is a primitive.
 */
export function isPrimitive(value: unknown): value is Primitive {
  return value === null || (typeof value !== "object" && typeof value !== "function");
}

/**
 * Determines whether the provided value is a DOM Node.
 */
export function isNode<T>(value: T): value is T & Node {
  return value instanceof Node;
}

/**
 * Determines whether the provided value is a non-null object.
 */
export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

/**
 * Determines whether the provided value resembles an HTML element.
 */
export function isTagLike<T>(value: T): value is T & { tagName?: string } {
  return isObject(value) && "tagName" in (value as object);
}

/**
 * Determines whether the provided value is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Determines whether the provided value is callable.
 */
export function isFunction<T extends Function>(value: unknown): value is T {
  return typeof value === "function";
}
