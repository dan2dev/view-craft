/**
 * @vitest-environment node
 */

import "../../main.ts";

describe("dom manipulation", () => {
  it("use node in this test file", () => {

    const component = div("this is a simple test")(null, 0);

    expect(component.toString()).toBe("<div>this is a simple test</div>");
    // expect(true).toBeTruthy();
  });

  it("type check for input", () => {
    // const component = div(
    //   // input()
    // )(null, 0);
    // expect(component.toString()).toBe("<div><input /></div>");
  });
});
