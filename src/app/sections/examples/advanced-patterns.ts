import { advancedPatterns } from '../../content/patterns';
import { codeBlock } from '../../ui/code-block';

export function advancedPatternsSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold', style: 'color: var(--text-primary);' }, 'Advanced patterns'),
    p({ className: 'text-base', style: 'color: var(--text-secondary);' }, 'Build richer UIs by composing helpers—no components or memo hoops required.'),
    div(
      { className: 'flex flex-col gap-8' },
      ...advancedPatterns.map(({ title, description, code }) =>
        article(
          { className: 'flex flex-col gap-4 rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl', style: 'background-color: var(--section-card-bg); border-color: var(--section-card-border);' },
          div(
            { className: 'space-y-2' },
            h3({ className: 'text-lg font-semibold', style: 'color: var(--text-primary);' }, title),
            p({ className: 'text-sm leading-relaxed', style: 'color: var(--text-secondary);' }, description)
          ),
          codeBlock('ts', code)
        )
      )
    )
  );
}
