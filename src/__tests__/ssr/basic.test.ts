/**
 * @vitest-environment node
 */
// import "view-craft";
import "../../main";

describe("dom manipulation", () => {
  it("use node in this test file", () => {
    
    const component = div("this is a simple test")(null, 0);

    expect(component.toString()).toBe("<div>this is a simple test</div>");
    // expect(true).toBeTruthy();
  });
});
