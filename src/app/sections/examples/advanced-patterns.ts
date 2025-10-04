import { advancedPatterns } from '../../content/patterns';
import { codeBlock } from '../../ui/code-block';

export function advancedPatternsSection() {
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
      }, 'Advanced patterns'),
      p({
        className: "mb-12 text-base text-vc-secondary",
      }, 'Build richer UIs by composing helpers—no components or memo hoops required.'),
      div(
        {
          className: "space-y-6",
        },
        ...advancedPatterns.map(({ title, description, code }) =>
          article(
            {
              className: "bg-white rounded-vc-card p-6 border border-vc-border",
            },
            div(
              {
                className: "mb-6",
              },
              h3({
                className: "text-xl mb-3 font-semibold",
              }, title),
              p({
                className: "text-sm text-vc-secondary",
              }, description)
            ),
            codeBlock('ts', code)
          )
        )
      )
    )
  );
}
