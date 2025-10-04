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
        "Import ViewCraft once to register the global helpers, then build reactive interfaces with plain functions. No generators, no boilerplate, just elements and state you understand.",
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
          className: "list-disc pl-6 space-y-3 text-vc-secondary text-sm",
        },
        li("Import 'view-craft' once to register more than 140 HTML and SVG helpers globally."),
        li("Compose interfaces with familiar tag functions like div(), h1(), and button()."),
        li("Wrap reactive bits in zero-argument functions, for example () => `Count: ${count}`."),
        li("Call update() when your mutations are ready to sync with the DOM."),
        li("Skip the virtual DOM and unnecessary proxies—ViewCraft works directly with real nodes.")
      )
    ),
  );
}
