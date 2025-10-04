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
        "Get started with view-craft in seconds. Just install the package and you're ready to go.",
      ),
      codeBlock("bash", "npm install view-craft"),
      p({
        className: "mt-4 text-sm text-vc-muted",
      }, "Also works with pnpm, yarn, or whatever package manager you prefer.")
    ),
  );
}
