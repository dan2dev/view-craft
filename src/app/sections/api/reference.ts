import { coreFunctions } from '../../content/api';
import { codeBlock } from '../../ui/code-block';

export function apiReferenceSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold', style: 'color: var(--text-primary);' }, 'Core API surface'),
    p({ className: 'text-base', style: 'color: var(--text-secondary);' }, 'The essentials you will use every day. Each helper is globally registered after importing view-craft.'),
    div(
      { className: 'grid gap-6 md:grid-cols-2' },
      ...coreFunctions.map(({ name, signature, description, notes }) =>
        article(
          { className: 'space-y-3 rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]', style: 'background-color: var(--section-card-bg); border-color: var(--section-card-border);' },
          h3({ className: 'text-lg font-semibold', style: 'color: var(--text-primary);' }, name),
          codeBlock('ts', signature),
          p({ className: 'text-sm leading-relaxed', style: 'color: var(--text-secondary);' }, description),
          notes ? p({ className: 'text-sm leading-relaxed', style: 'color: var(--text-tertiary);' }, notes) : null
        )
      )
    )
  );
}
