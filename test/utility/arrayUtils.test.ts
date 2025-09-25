/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { 
  arraysEqual, 
  createMultiMap, 
  addToMultiMap, 
  takeFromMultiMap 
} from '../../src/utility/arrayUtils';

describe('Array Utils', () => {
  describe('arraysEqual', () => {
    it('should return true for identical arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      expect(arraysEqual(arr1, arr2)).toBe(true);
    });

    it('should return true for same array reference', () => {
      const arr = [1, 2, 3];
      expect(arraysEqual(arr, arr)).toBe(true);
    });

    it('should return false for different lengths', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2];
      expect(arraysEqual(arr1, arr2)).toBe(false);
    });

    it('should return false for different content', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];
      expect(arraysEqual(arr1, arr2)).toBe(false);
    });

    it('should handle empty arrays', () => {
      expect(arraysEqual([], [])).toBe(true);
      expect(arraysEqual([], [1])).toBe(false);
      expect(arraysEqual([1], [])).toBe(false);
    });

    it('should use reference equality for objects', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 1 };
      const obj3 = obj1;
      
      expect(arraysEqual([obj1], [obj2])).toBe(false); // Different references
      expect(arraysEqual([obj1], [obj3])).toBe(true);  // Same reference
    });

    it('should handle arrays with null and undefined', () => {
      expect(arraysEqual([null], [null])).toBe(true);
      expect(arraysEqual([undefined], [undefined])).toBe(true);
      expect(arraysEqual([null], [undefined])).toBe(false);
    });

    it('should handle arrays with mixed types', () => {
      const arr1 = [1, 'string', true, null];
      const arr2 = [1, 'string', true, null];
      const arr3 = [1, 'string', false, null];
      
      expect(arraysEqual(arr1, arr2)).toBe(true);
      expect(arraysEqual(arr1, arr3)).toBe(false);
    });

    it('should handle arrays with duplicate values', () => {
      const obj = { id: 1 };
      const arr1 = [obj, obj, obj];
      const arr2 = [obj, obj, obj];
      
      expect(arraysEqual(arr1, arr2)).toBe(true);
    });

    it('should be performant with large arrays', () => {
      const size = 10000;
      const arr1 = Array(size).fill(0).map((_, i) => i);
      const arr2 = Array(size).fill(0).map((_, i) => i);
      const arr3 = Array(size).fill(0).map((_, i) => i === size - 1 ? i + 1 : i);
      
      expect(arraysEqual(arr1, arr2)).toBe(true);
      expect(arraysEqual(arr1, arr3)).toBe(false);
    });

    it('should handle arrays with symbols', () => {
      const sym1 = Symbol('test');
      const sym2 = Symbol('test');
      
      expect(arraysEqual([sym1], [sym1])).toBe(true);
      expect(arraysEqual([sym1], [sym2])).toBe(false);
    });

    it('should handle sparse arrays', () => {
      const arr1 = [1, , 3]; // sparse array
      const arr2 = [1, undefined, 3];
      const arr3 = [1, , 3];
      
      // In JavaScript, sparse arrays with holes are different from arrays with undefined
      // but .every() treats holes as undefined, so they compare equal in our implementation
      expect(arraysEqual(arr1, arr2)).toBe(true); // Both have undefined at index 1
      expect(arraysEqual(arr1, arr3)).toBe(true);
    });
  });

  describe('createMultiMap', () => {
    it('should create an empty multi-map', () => {
      const map = createMultiMap<string, number>();
      expect(map).toBeInstanceOf(Map);
      expect(map.size).toBe(0);
    });

    it('should be properly typed', () => {
      const stringToNumbers = createMultiMap<string, number>();
      const numberToStrings = createMultiMap<number, string>();
      
      // TypeScript compilation test - these should not cause type errors
      expect(stringToNumbers).toBeDefined();
      expect(numberToStrings).toBeDefined();
    });

    it('should create independent map instances', () => {
      const map1 = createMultiMap<string, number>();
      const map2 = createMultiMap<string, number>();
      
      expect(map1).not.toBe(map2);
      expect(map1.size).toBe(0);
      expect(map2.size).toBe(0);
    });
  });

  describe('addToMultiMap', () => {
    it('should add values to new keys', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      
      expect(map.has('key1')).toBe(true);
      expect(map.get('key1')).toEqual([1]);
    });

    it('should add values to existing keys', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key1', 2);
      addToMultiMap(map, 'key1', 3);
      
      expect(map.get('key1')).toEqual([1, 2, 3]);
    });

    it('should handle multiple keys', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key2', 2);
      addToMultiMap(map, 'key1', 3);
      
      expect(map.get('key1')).toEqual([1, 3]);
      expect(map.get('key2')).toEqual([2]);
    });

    it('should handle duplicate values', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key1', 1);
      
      expect(map.get('key1')).toEqual([1, 1, 1]);
    });

    it('should handle object values', () => {
      const map = createMultiMap<string, object>();
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      
      addToMultiMap(map, 'objects', obj1);
      addToMultiMap(map, 'objects', obj2);
      
      expect(map.get('objects')).toEqual([obj1, obj2]);
    });

    it('should handle null and undefined values', () => {
      const map = createMultiMap<string, any>();
      addToMultiMap(map, 'key1', null);
      addToMultiMap(map, 'key1', undefined);
      addToMultiMap(map, 'key1', 0);
      
      expect(map.get('key1')).toEqual([null, undefined, 0]);
    });

    it('should handle symbol keys', () => {
      const map = createMultiMap<symbol, string>();
      const sym = Symbol('test');
      
      addToMultiMap(map, sym, 'value1');
      addToMultiMap(map, sym, 'value2');
      
      expect(map.get(sym)).toEqual(['value1', 'value2']);
    });

    it('should maintain insertion order', () => {
      const map = createMultiMap<string, string>();
      const values = ['first', 'second', 'third', 'fourth', 'fifth'];
      
      values.forEach(value => addToMultiMap(map, 'key', value));
      
      expect(map.get('key')).toEqual(values);
    });
  });

  describe('takeFromMultiMap', () => {
    it('should return null for non-existent keys', () => {
      const map = createMultiMap<string, number>();
      expect(takeFromMultiMap(map, 'nonexistent')).toBe(null);
    });

    it('should return null for empty arrays', () => {
      const map = createMultiMap<string, number>();
      map.set('empty', []);
      expect(takeFromMultiMap(map, 'empty')).toBe(null);
    });

    it('should take the first value from arrays', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key1', 2);
      addToMultiMap(map, 'key1', 3);
      
      expect(takeFromMultiMap(map, 'key1')).toBe(1);
      expect(map.get('key1')).toEqual([2, 3]);
    });

    it('should remove key when array becomes empty', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      
      expect(takeFromMultiMap(map, 'key1')).toBe(1);
      expect(map.has('key1')).toBe(false);
    });

    it('should handle multiple takes', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key1', 2);
      addToMultiMap(map, 'key1', 3);
      
      expect(takeFromMultiMap(map, 'key1')).toBe(1);
      expect(takeFromMultiMap(map, 'key1')).toBe(2);
      expect(takeFromMultiMap(map, 'key1')).toBe(3);
      expect(takeFromMultiMap(map, 'key1')).toBe(null);
      expect(map.has('key1')).toBe(false);
    });

    it('should handle object values correctly', () => {
      const map = createMultiMap<string, object>();
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      
      addToMultiMap(map, 'objects', obj1);
      addToMultiMap(map, 'objects', obj2);
      
      expect(takeFromMultiMap(map, 'objects')).toBe(obj1);
      expect(takeFromMultiMap(map, 'objects')).toBe(obj2);
      expect(takeFromMultiMap(map, 'objects')).toBe(null);
    });

    it('should handle null and undefined values', () => {
      const map = createMultiMap<string, any>();
      addToMultiMap(map, 'key', null);
      addToMultiMap(map, 'key', undefined);
      addToMultiMap(map, 'key', 0);
      
      expect(takeFromMultiMap(map, 'key')).toBe(null);
      expect(takeFromMultiMap(map, 'key')).toBe(undefined);
      expect(takeFromMultiMap(map, 'key')).toBe(0);
      expect(takeFromMultiMap(map, 'key')).toBe(null);
    });

    it('should maintain FIFO order', () => {
      const map = createMultiMap<string, string>();
      const values = ['first', 'second', 'third', 'fourth', 'fifth'];
      
      values.forEach(value => addToMultiMap(map, 'queue', value));
      
      values.forEach(expectedValue => {
        expect(takeFromMultiMap(map, 'queue')).toBe(expectedValue);
      });
      
      expect(takeFromMultiMap(map, 'queue')).toBe(null);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex workflows', () => {
      const map = createMultiMap<string, { id: number; name: string }>();
      
      // Add multiple items
      addToMultiMap(map, 'users', { id: 1, name: 'Alice' });
      addToMultiMap(map, 'users', { id: 2, name: 'Bob' });
      addToMultiMap(map, 'admins', { id: 3, name: 'Charlie' });
      
      expect(map.size).toBe(2);
      expect(map.get('users')?.length).toBe(2);
      expect(map.get('admins')?.length).toBe(1);
      
      // Take items
      const firstUser = takeFromMultiMap(map, 'users');
      expect(firstUser?.name).toBe('Alice');
      expect(map.get('users')?.length).toBe(1);
      
      // Add more items
      addToMultiMap(map, 'users', { id: 4, name: 'David' });
      expect(map.get('users')?.length).toBe(2);
      
      // Take all remaining users
      const secondUser = takeFromMultiMap(map, 'users');
      const thirdUser = takeFromMultiMap(map, 'users');
      const noMoreUsers = takeFromMultiMap(map, 'users');
      
      expect(secondUser?.name).toBe('Bob');
      expect(thirdUser?.name).toBe('David');
      expect(noMoreUsers).toBe(null);
      expect(map.has('users')).toBe(false);
      expect(map.has('admins')).toBe(true);
    });

    it('should handle concurrent operations on different keys', () => {
      const map = createMultiMap<string, number>();
      
      // Simulate concurrent operations
      addToMultiMap(map, 'key1', 1);
      addToMultiMap(map, 'key2', 10);
      addToMultiMap(map, 'key1', 2);
      addToMultiMap(map, 'key2', 20);
      
      expect(takeFromMultiMap(map, 'key1')).toBe(1);
      expect(takeFromMultiMap(map, 'key2')).toBe(10);
      expect(takeFromMultiMap(map, 'key1')).toBe(2);
      expect(takeFromMultiMap(map, 'key2')).toBe(20);
      
      expect(map.size).toBe(0);
    });

    it('should handle large datasets efficiently', () => {
      const map = createMultiMap<string, number>();
      const itemCount = 10000;
      
      // Add large number of items
      for (let i = 0; i < itemCount; i++) {
        addToMultiMap(map, 'large', i);
      }
      
      expect(map.get('large')?.length).toBe(itemCount);
      
      // Take all items
      for (let i = 0; i < itemCount; i++) {
        expect(takeFromMultiMap(map, 'large')).toBe(i);
      }
      
      expect(map.has('large')).toBe(false);
    });

    it('should handle edge cases with array mutation', () => {
      const map = createMultiMap<string, number>();
      addToMultiMap(map, 'key', 1);
      addToMultiMap(map, 'key', 2);
      
      // Get reference to array
      const array = map.get('key');
      expect(array).toEqual([1, 2]);
      
      // Take item should modify the same array reference
      takeFromMultiMap(map, 'key');
      expect(array).toEqual([2]);
      
      // Final take should remove the key
      takeFromMultiMap(map, 'key');
      expect(map.has('key')).toBe(false);
    });
  });
});