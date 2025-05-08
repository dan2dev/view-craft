/**
 * @vitest-environment jsdom
 */

describe("dom manipulation", () => {
  test("test a simple component", () => {
    const component = div("this is a simple test");

    expect(component).not.toBeNull();
  });
});
