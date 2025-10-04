import { codeBlock } from "../../ui/code-block";

export function installationSection() {
  return section(
    {
      className: "py-20 bg-vc-bgCard border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-4xl",
      },
      h2({
        className: "mb-4",
      }, "Installation"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "Install once to unlock 140+ typed DOM helpers and a lean reactive runtime. Every tag you expect is ready the moment the package lands in your project.",
      ),
      codeBlock("bash", "npm install view-craft"),
      p({
        className: "mt-4 mb-8 text-sm text-vc-muted",
      }, "Prefer pnpm, yarn, or bun? Swap the command and go—ViewCraft plays nicely with every modern package manager."),
      h3({
        className: "mb-4 mt-12",
      }, "Usage"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "Import the library once to register global helpers like div(), update(), list(), and when(). From there you build with real DOM nodes, not abstractions, and decide exactly when updates flush.",
      ),
      codeBlock(
        "ts",
        String.raw`
import 'view-craft';

let count = 0;

const app = div(
  h1(() => \`Count: \${count}\`),
  button('Increment', on('click', () => { count++; update(); }))
);

render(app);
`.replaceAll(/\\/g, ""),
      ),
    ),
  );
}
