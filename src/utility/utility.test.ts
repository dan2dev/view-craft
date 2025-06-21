/**
 * @vitest-environment node
 */
import { describe, expect } from 'vitest';
import { isBrowser, isNode } from './isBrowser';

describe('Utility Node', () => {
  test('isBrowser', () => {
    expect(isBrowser).toBe(false);
  });
  test('isNode', () => {
    expect(isNode).toBe(true);
  });
});
