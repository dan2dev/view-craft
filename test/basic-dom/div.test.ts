// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { div } from "../../src/core/index";

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
});


