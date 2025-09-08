// @vitest-environment jsdom
import "../../src/index";
import { describe, it, expect } from "vitest";


describe("div NodeBuilder", () => {
  it("should create a div element", () => {
    // Create a dummy parent element
    const parent = document.createElement("div");
    // Use the div NodeBuilder
    const nodeBuilder = div();
    const element = nodeBuilder(parent, 0);
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(element.tagName.toLowerCase()).toBe("div");
  });

  it("should append children and text nodes", () => {
    const parent = document.createElement("div");
    const nodeBuilder = div(
      "Hello, ",
      document.createElement("span"),
      () => "World!"
    );
    const element = nodeBuilder(parent, 0);
    expect(element.childNodes.length).toBe(3);
    expect(element.childNodes[0].textContent).toBe("Hello, ");
    expect(element.childNodes[1]).toBeInstanceOf(HTMLSpanElement);
    expect(element.childNodes[2].textContent).toBe("World!");
  });
  it("should set attributes and properties", () => {
    const parent = document.createElement("div");
    const nodeBuilder = div(
      { id: "test-div", className: "my-class" },
      "Content"
    );
    const element = nodeBuilder(parent, 0);
    expect(element.id).toBe("test-div");
    expect(element.className).toBe("my-class");
    expect(element.textContent).toBe("Content");
  });
});


