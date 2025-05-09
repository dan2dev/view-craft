/**
 * @vitest-environment node
 */
import { describe, expect } from 'vitest';
import { isBrowser } from './isBrowser';

describe('Utility Node', () => {
  test('isBrowser', () => {
    expect(isBrowser).toBe(false);
  });
});
