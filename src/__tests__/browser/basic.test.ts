/**
 * @vitest-environment jsdom
 */
import "view-craft";

describe("dom manipulation", () => {
  it.skip("test a simple component", () => {
    const component = div("this is a simple test");

    expect(component).not.toBeNull();
  });
});
