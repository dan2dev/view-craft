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
        "One import to rule them all. Seriously, just one line and you get 140+ global functions. It's like Christmas morning for your code editor.",
      ),
      codeBlock("bash", "npm install view-craft"),
      p({
        className: "mt-4 mb-8 text-sm text-vc-muted",
      }, "Team pnpm? Team yarn? Team bun? We don't judge. Swap npm for whatever brings you joy."),
      h3({
        className: "mb-4 mt-12",
      }, "Usage"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "Simply import once to register all global functions. Then start using div(), update(), on(), list(), when(), render(), etc. globally. Like they're part of the language. Which they basically are now.",
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
