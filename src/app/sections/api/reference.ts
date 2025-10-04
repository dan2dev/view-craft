import { coreFunctions } from '../../content/api';
import { codeBlock } from '../../ui/code-block';

export function apiReferenceSection() {
  return section(
    {
      className: "py-20 bg-vc-bg border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-6xl",
      },
      h2({
        className: "mb-4",
      }, 'Core API surface'),
      p({
        className: "mb-12 text-base text-vc-secondary",
      }, 'The essentials you will use every day. Each helper is globally registered after importing view-craft.'),
      div(
        {
          className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        },
        ...coreFunctions.map(({ name, signature, description, notes }) =>
          article(
            {
              className: "bg-vc-bgCard rounded-vc-card p-6 border border-vc-border",
            },
            h3({
              className: "mb-4 text-lg font-semibold",
            }, name),
            codeBlock('ts', signature),
            p({
              className: "mt-4 text-sm text-vc-secondary",
            }, description),
            notes ? p({
              className: "mt-2 text-xs text-vc-muted italic",
            }, notes) : null
          )
        )
      )
    )
  );
}
