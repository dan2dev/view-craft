import { codeBlock } from "../../ui/code-block";

export function installationSection() {
  return section(
    { className: "space-y-6" },
    h2({ className: "text-3xl font-semibold", style: 'color: var(--text-primary);' }, "Install & register globals"),
    p(
      { className: "text-base", style: 'color: var(--text-secondary);' },
      "One import to rule them all. Seriously, just one line and you get 140+ global functions. It's like Christmas morning for your code editor.",
    ),
    codeBlock("bash", "pnpm add view-craft"),
    p({ className: "text-base", style: 'color: var(--text-secondary);' }, "Team npm? Team yarn? We don't judge. Swap pnpm for whatever brings you joy."),
    h3({ className: "text-xl font-semibold", style: 'color: var(--text-primary);' }, "Bootstrap your app"),
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
  );
}
