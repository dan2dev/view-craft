import { highlights } from '../../content/highlights';

export function highlightSection() {
  return section(
    { className: 'grid gap-6 md:grid-cols-2' },
    ...highlights.map(({ title, description }) =>
      article(
        { className: 'rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10 transition hover:border-slate-700' },
        h3({ className: 'text-lg font-semibold text-slate-50' }, title),
        p({ className: 'mt-2 text-sm text-slate-300' }, description)
      )
    )
  );
}
