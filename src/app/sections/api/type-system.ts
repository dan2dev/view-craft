import { codeBlock } from '../../ui/code-block';

export function typeSystemSection() {
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
      }, 'TypeScript integration'),
      p({
        className: "mb-8 text-base text-vc-secondary",
      }, 'Enable IDE hints for all 140+ tags by extending your compiler configuration.'),
      codeBlock(
        'json',
        String.raw`
{
  "compilerOptions": {
    "types": ["view-craft/types"]
  }
}
`
      ),
      p({
        className: "mb-4 text-sm text-vc-secondary",
      }, 'Alternatively, add /// <reference types="view-craft/types" /> to vite-env.d.ts.'),
      p({
        className: "text-sm text-vc-muted",
      }, 'Strict mode is fully supported; lean on it when extending DOM helpers or creating custom utilities.')
    )
  );
}
