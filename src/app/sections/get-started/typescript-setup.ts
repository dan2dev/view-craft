import { codeBlock } from "../../ui/code-block";

export function typescriptSetupSection() {
  return section(
    {
      className: "py-20 bg-white border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-4xl",
      },
      h2({
        className: "mb-4",
      }, "TypeScript Setup"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "view-craft is TypeScript-first. Get full type safety for all 140+ tags and their attributes.",
      ),

      h3({
        className: "mb-4",
      }, "Option 1: Add to tsconfig.json"),
      codeBlock(
        "json",
        `{
  "compilerOptions": {
    "types": ["view-craft/types"]
  }
}`
      ),

      h3({
        className: "mb-4 mt-12",
      }, "Option 2: Add to vite-env.d.ts"),
      codeBlock(
        "ts",
        `/// <reference types="view-craft/types" />`
      ),

      div(
        {
          className: "mt-8 p-6 bg-vc-bg rounded-vc-card border border-vc-border",
        },
        h4({
          className: "mb-3 font-semibold",
        }, "What you get"),
        ul(
          {
            className: "list-disc pl-6 space-y-2 text-sm text-vc-secondary",
          },
          li("Full autocomplete for all HTML and SVG tags"),
          li("Type-safe attributes and event handlers"),
          li("IntelliSense for reactive functions and API methods"),
          li("Compile-time error checking")
        )
      )
    ),
  );
}
