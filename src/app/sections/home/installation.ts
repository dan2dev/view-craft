import { codeBlock } from "../../ui/code-block";

export function installationSection() {
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
      }, "Install & register globals"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "One import to rule them all. Seriously, just one line and you get 140+ global functions. It's like Christmas morning for your code editor.",
      ),
      codeBlock("bash", "pnpm add view-craft"),
      p({
        className: "mt-4 mb-8 text-sm text-vc-muted",
      }, "Team npm? Team yarn? We don't judge. Swap pnpm for whatever brings you joy."),
      h3({
        className: "mb-4 mt-12",
      }, "Bootstrap your app"),
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
