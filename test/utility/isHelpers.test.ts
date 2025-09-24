// @vitest-environment jsdom
import { isNode, isNotNullObject, isTag, isBoolean, isFunction } from "../../src/utils";
import { describe, it, expect } from "vitest";

describe("utility is helpers", () => {
  it("isNode returns true for Nodes", () => {
    const div = document.createElement("div");
    expect(isNode(div)).toBe(true);
    expect(isNode(null)).toBe(false);
    expect(isNode({})).toBe(false);
  });

  it("isNotNullObject returns true for plain objects", () => {
    expect(isNotNullObject({})).toBe(true);
    expect(isNotNullObject([])).toBe(true);
    expect(isNotNullObject(null)).toBe(false);
    expect(isNotNullObject(42)).toBe(false);
  });

  it("isTag returns true for objects with tagName", () => {
    expect(isTag({ tagName: "div" })).toBe(true);
    expect(isTag({})).toBe(false);
    expect(isTag(null)).toBe(false);
  });

  it("isBoolean properly identifies booleans", () => {
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean("true")).toBe(false);
  });

  it("isFunction detects functions", () => {
    expect(isFunction(() => 1)).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction("fn")).toBe(false);
    expect(isFunction(1)).toBe(false);
  });
});
