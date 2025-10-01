import { animatedLogo } from '../../ui/animated-logo';

export function heroSection(navigate: (path: string) => void) {
  const makeHandler = (path: string) =>
    on('click', (event: Event) => {
      event.preventDefault();
      navigate(path);
    });

  return header(
    { className: 'relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 px-6 py-24 sm:py-32' },
    animatedLogo(),
    div(
      { className: 'mx-auto flex max-w-4xl flex-col items-center gap-6 text-center' },
      span(
        { className: 'rounded-full border border-emerald-700/40 bg-emerald-950/30 px-4 py-1 text-sm text-emerald-300' },
        'view-craft · DOM-first UI library'
      ),
      h1(
        { className: 'text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl' },
        'Finally, a framework that ',
        span({ className: 'text-emerald-400' }, 'doesn\'t update behind your back')
      ),
      p(
        { className: 'max-w-2xl text-base text-slate-300 sm:text-lg' },
        'Mutate state, call ',
        code({ className: 'rounded bg-slate-800 px-2 py-1 text-emerald-400' }, 'update()'),
        ', and ship. No virtual DOM, no build-time wizardry, just vibes and vanilla browser APIs with a productivity twist.'
      ),
      div(
        { className: 'flex flex-wrap items-center justify-center gap-4' },
        a(
          {
            className: 'rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 hover:shadow-emerald-400/30',
            href: '#overview',
          },
          makeHandler('overview'),
          'Overview'
        ),
        a(
          {
            className: 'rounded-full border border-emerald-700/50 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500 hover:bg-emerald-950/40 hover:text-emerald-200',
            href: '#api',
          },
          makeHandler('api'),
          'API reference'
        ),
        a(
          {
            className: 'rounded-full border border-emerald-700/50 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500 hover:bg-emerald-950/40 hover:text-emerald-200',
            href: '#examples',
          },
          makeHandler('examples'),
          'Examples'
        )
      )
    )
  );
}
