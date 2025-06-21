/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { setProp } from "./setProp";

describe("setProp", () => {
  it("should define a property with the correct value", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "foo", 123);
    expect(obj.foo).toBe(123);
  });

  it("should set configurable, enumerable, and writable to false by default", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "bar", "baz");
    const desc = Object.getOwnPropertyDescriptor(obj, "bar");
    expect(desc).toMatchObject({
      configurable: false,
      enumerable: false,
      writable: false,
      value: "baz",
    });
  });

  it("should set configurable, enumerable, and writable to true when specified", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "x", 42, true, true, true);
    const desc = Object.getOwnPropertyDescriptor(obj, "x");
    expect(desc).toMatchObject({
      configurable: true,
      enumerable: true,
      writable: true,
      value: 42,
    });
  });

  it("should allow overwriting an existing property if configurable is true", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "y", 1, true, false, false);
    setProp(obj, "y", 2, true, false, false);
    expect(obj.y).toBe(2);
  });

  it("should not allow overwriting an existing property if configurable is false", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "z", 1, false, false, false);
    expect(() => setProp(obj, "z", 2, false, false, false)).toThrow();
    expect(obj.z).toBe(1);
  });

  it("should respect the enumerable flag", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "hidden", "secret", false, false, false);
    setProp(obj, "visible", "public", false, true, false);

    const keys = Object.keys(obj);
    expect(keys).toContain("visible");
    expect(keys).not.toContain("hidden");
  });

  it("should respect the writable flag", () => {
    const obj: Record<string, any> = {};
    setProp(obj, "immutable", "fixed", true, true, false);
    expect(() => {
      obj.immutable = "changed";
    }).toThrow(TypeError);
    expect(obj.immutable).toBe("fixed");

    setProp(obj, "mutable", "changeable", true, true, true);
    obj.mutable = "changed";
    expect(obj.mutable).toBe("changed");
  });
});
