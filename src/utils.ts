export const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export const isPrimitive = (val: unknown): val is string | number | boolean | symbol | bigint | undefined | null => {
  return val === null || (typeof val !== "object" && typeof val !== "function");
};

export function isNode<T>(value: T): value is T & Node {
  return value instanceof Node;
}

export function isNotNullObject<T>(value: T): value is T & object {
  return typeof value === "object" && value !== null;
}

export function isTag<T>(value: T): value is T & { tagName?: string } {
  return (typeof value === "object" &&
    value !== null &&
    "tagName" in value) satisfies boolean;
}

export function isBoolean<T>(value: T): value is boolean & any {
  return typeof value === "boolean";
}

export function isFunction<T>(value: T): value is Function & any {
  return typeof value === "function";
}

export namespace Dom {
  export function push(parent: HTMLElement, ...children: (HTMLElement | string)[]) {
    children.forEach((child) => {
      if (typeof child === "string") {
        parent.appendChild(document.createTextNode(child));
      } else {
        parent.appendChild(child);
      }
    });
    return parent;
  }
}