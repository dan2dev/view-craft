import { codeBlock } from "../../ui/code-block";

export function installationStepsSection() {
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
      }, "Installation"),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "Ready to join the dozens of developers who peaked in the jQuery era? Just one command:",
      ),
      codeBlock("bash", "npm install view-craft"),
      p({
        className: "mt-4 text-sm text-vc-muted",
      }, "Works with pnpm, yarn, bun, or whatever package manager brings you joy. We're not here to judge your life choices.")
    ),
  );
}
