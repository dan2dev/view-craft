/**
 * @vitest-environment jsdom
 */
import { describe, expect } from 'vitest';
import { isBrowser } from './isBrowser';

describe('Utility Browser', () => {
  test('isBrowser', () => {
    expect(isBrowser).toBe(true);
  });
});
