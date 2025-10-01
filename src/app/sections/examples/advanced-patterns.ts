import { advancedPatterns } from '../../content/patterns';
import { codeBlock } from '../../ui/code-block';

export function advancedPatternsSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Advanced patterns'),
    p({ className: 'text-base text-slate-300' }, 'Build richer UIs by composing helpers—no components or memo hoops required.'),
    div(
      { className: 'flex flex-col gap-8' },
      ...advancedPatterns.map(({ title, description, code }) =>
        article(
          { className: 'flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10' },
          div(
            { className: 'space-y-2' },
            h3({ className: 'text-lg font-semibold text-slate-50' }, title),
            p({ className: 'text-sm text-slate-300' }, description)
          ),
          codeBlock('ts', code)
        )
      )
    )
  );
}
