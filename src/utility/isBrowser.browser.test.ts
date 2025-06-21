/**
 * @vitest-environment jsdom
 */
import { describe, expect } from "vitest";
import { isBrowser, isNode } from "./isBrowser";

describe("Utility Browser", () => {
  test("isBrowser", () => {
    expect(isBrowser).toBe(true);
  });
  test("isNode", () => {
    expect(isNode).toBe(false);
  });
});
