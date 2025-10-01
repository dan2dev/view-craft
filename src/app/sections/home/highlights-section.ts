import { highlights } from '../../content/highlights';

export function highlightSection() {
  return section(
    { className: 'grid gap-6 md:grid-cols-2' },
    ...highlights.map(({ title, description }) =>
      article(
        { className: 'rounded-2xl border border-emerald-900/30 bg-gradient-to-br from-slate-900/80 to-emerald-950/20 p-6 shadow-lg shadow-black/10 transition hover:border-emerald-700/50 hover:shadow-emerald-900/10' },
        h3({ className: 'text-lg font-semibold text-emerald-300' }, title),
        p({ className: 'mt-2 text-sm text-slate-300' }, description)
      )
    )
  );
}
