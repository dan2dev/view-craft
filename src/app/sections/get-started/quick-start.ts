import { codeBlock } from "../../ui/code-block";

export function quickStartSection() {
  return section(
    {
      className: "py-20 bg-vc-bg border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-4xl",
      },
      h2({
        className: "mb-4",
      }, "Quick Start"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "Import once to register all global functions, then start building. That's it.",
      ),
      codeBlock(
        "ts",
        String.raw`
import 'view-craft';

// Now use div(), update(), on(), list(), when(), render(), etc. globally
let count = 0;

const app = div(
  h1(() => \`Count: \${count}\`),
  button('Click', on('click', () => { count++; update(); }))
);

render(app);
`.replaceAll(/\\/g, ""),
      ),
      h3({
        className: "mb-4 mt-12",
      }, "How it works"),
      ul(
        {
          className: "list-disc pl-6 space-y-3 text-vc-secondary",
        },
        li("Import 'view-craft' to register 140+ global functions (all HTML/SVG tags)"),
        li("Build your UI using familiar tag functions like div(), h1(), button()"),
        li("Use functions for reactive content: () => `Count: ${count}`"),
        li("Call update() when you're ready to sync changes to the DOM"),
        li("That's it! No virtual DOM, no magic, just direct DOM manipulation")
      )
    ),
  );
}
