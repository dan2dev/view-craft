import { routes } from '../routes';

export function navigation(getPath: () => string, onNavigate: (path: string) => void) {
  return nav(
    { className: 'sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur' },
    div(
      { className: 'mx-auto flex max-w-6xl items-center justify-between px-6 py-4' },
      a(
        {
          href: '#overview',
          className: 'text-lg font-semibold text-slate-100 transition hover:text-white',
        },
        on('click', event => {
          event.preventDefault();
          onNavigate('overview');
        }),
        'view-craft'
      ),
      div(
        { className: 'flex flex-wrap items-center gap-2' },
        ...routes.map(({ path, label }) => {
          const activeClass = 'rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow transition';
          const idleClass = 'rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white';

          return a(
            {
              href: `#${path}`,
              className: () =>
                getPath() === path ? activeClass : idleClass,
            },
            on('click', event => {
              event.preventDefault();
              onNavigate(path);
            }),
            label
          );
        })
      )
    )
  );
}
