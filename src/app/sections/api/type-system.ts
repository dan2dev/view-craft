import { codeBlock } from '../../ui/code-block';

export function typeSystemSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'TypeScript integration'),
    p({ className: 'text-base text-slate-300' }, 'Enable IDE hints for all 140+ tags by extending your compiler configuration.'),
    codeBlock(
      'json',
      String.raw`
{
  "compilerOptions": {
    "types": ["vite/client", "view-craft/types"]
  }
}
`
    ),
    p({ className: 'text-base text-slate-300' }, 'Alternatively, add /// <reference types="view-craft/types" /> to vite-env.d.ts.'),
    p({ className: 'text-base text-slate-300' }, 'Strict mode is fully supported; lean on it when extending DOM helpers or creating custom utilities.')
  );
}
