/**
 * @vitest-environment node
 */

describe("dom manipulation", () => {
  test("use jsdom in this test file", () => {
    const element = document.createElement("div");
    const childElement = document.createElement("span");
    element.insertBefore(childElement, element.firstChild);


    expect(element).not.toBeNull();
  });
});