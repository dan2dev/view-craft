/**
 * Efficiently compares two arrays for equality by reference and content.
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

/**
 * Creates a map where each key contains an array of values.
 * Useful for grouping items by a common property.
 */
export function createMultiMap<K, V>(): Map<K, V[]> {
  return new Map<K, V[]>();
}

/**
 * Adds a value to a multi-map, creating the array if it doesn't exist.
 */
export function addToMultiMap<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const existing = map.get(key);
  if (existing) {
    existing.push(value);
  } else {
    map.set(key, [value]);
  }
}

/**
 * Takes the first value from a multi-map array, removing it if it becomes empty.
 */
export function takeFromMultiMap<K, V>(map: Map<K, V[]>, key: K): V | null {
  const values = map.get(key);
  if (!values || values.length === 0) {
    return null;
  }

  const value = values.shift()!;
  if (values.length === 0) {
    map.delete(key);
  }

  return value;
}