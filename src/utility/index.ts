export * from "./isBrowser";

export function isNode<T>(value: T): value is T & Node {
  return value instanceof Node;
}

export function isNotNullObject<T>(value: T): value is T & object {
  return typeof value === "object" && value !== null;
}

export function isTag<T>(value: T): value is T & { tagName?: string } {
  return (typeof value === "object" && value !== null && "tagName" in value) satisfies boolean;
}

export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}
