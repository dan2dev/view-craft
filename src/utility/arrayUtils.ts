/**
 * Array utilities - essential functions and simple multi-map operations
 */

/**
 * Efficiently compares two arrays for equality by reference and content.
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const aHas = Object.prototype.hasOwnProperty.call(a, i);
    const bHas = Object.prototype.hasOwnProperty.call(b, i);
    // If either array has a hole at this index, treat as equal
    if (!aHas || !bHas) continue;
    if (a[i] !== b[i]) return false;
  }
  return true;
}
