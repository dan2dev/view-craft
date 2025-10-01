import { coreFunctions } from '../../content/api';
import { codeBlock } from '../../ui/code-block';

export function apiReferenceSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Core API surface'),
    p({ className: 'text-base text-slate-300' }, 'The essentials you will use every day. Each helper is globally registered after importing view-craft.'),
    div(
      { className: 'grid gap-6 md:grid-cols-2' },
      ...coreFunctions.map(({ name, signature, description, notes }) =>
        article(
          { className: 'space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10' },
          h3({ className: 'text-lg font-semibold text-slate-50' }, name),
          codeBlock('ts', signature),
          p({ className: 'text-sm text-slate-300' }, description),
          notes ? p({ className: 'text-sm text-slate-400' }, notes) : null
        )
      )
    )
  );
}
