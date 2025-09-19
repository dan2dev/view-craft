import { describe, it, expect } from 'vitest';
import { isBrowser } from '../../src/utility/isBrowser.js';

describe("isBrowser", () => {
  it("should be false in Node.js environment", () => {
    expect(isBrowser).toBe(false);
  });
});
