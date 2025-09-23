export const isPrimitive = (val: unknown): val is string | number | boolean | symbol | bigint | undefined | null => {
  return val === null || (typeof val !== "object" && typeof val !== "function");
};
