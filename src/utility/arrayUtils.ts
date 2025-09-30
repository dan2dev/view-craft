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
    if ((i in a ? a[i] : undefined) !== (i in b ? b[i] : undefined)) return false;
  }
  return true;
}
