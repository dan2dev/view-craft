/**
 * @vitest-environment jsdom
 */
import "view-craft";

describe("dom manipulation", () => {
  it("component builder must exist", () => {
    expect(div).toBeDefined();
  });
  it("test a simple component", () => {
    const component = div("this is a simple test")();

    expect(component.outerHTML).toBe("<div>this is a simple test</div>");
    expect(component).not.toBeNull();
  });
});
