import { codeBlock } from "../../ui/code-block";

export function installationStepsSection() {
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
        "Kick off your project with a single install command. ViewCraft keeps setup simple so you can move straight to building.",
      ),
      codeBlock("bash", "npm install view-craft"),
      p({
        className: "mt-4 text-sm text-vc-muted",
      }, "Prefer pnpm, yarn, or bun? Swap the executable and install—each manager is supported.")
    ),
  );
}
