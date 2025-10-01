export function heroSection(navigate: (path: string) => void) {
  const makeHandler = (path: string) =>
    on('click', (event: Event) => {
      event.preventDefault();
      navigate(path);
    });

  return header(
    { className: 'relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-24 sm:py-32' },
    div(
      { className: 'mx-auto flex max-w-4xl flex-col items-center gap-6 text-center' },
      span(
        { className: 'rounded-full border border-slate-700/70 px-4 py-1 text-sm text-slate-300' },
        'view-craft · DOM-first UI library'
      ),
      h1(
        { className: 'text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl' },
        'Build reactive UIs the explicit way'
      ),
      p(
        { className: 'max-w-2xl text-base text-slate-300 sm:text-lg' },
        'Mutate state, call update(), and ship interfaces without a virtual DOM in sight. view-craft keeps you close to browser primitives while staying productive.'
      ),
      div(
        { className: 'flex flex-wrap items-center justify-center gap-4' },
        a(
          {
            className: 'rounded-full bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/80',
            href: '#overview',
          },
          makeHandler('overview'),
          'Overview'
        ),
        a(
          {
            className: 'rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white',
            href: '#api',
          },
          makeHandler('api'),
          'API reference'
        ),
        a(
          {
            className: 'rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white',
            href: '#examples',
          },
          makeHandler('examples'),
          'Examples'
        )
      )
    )
  );
}
