import { navigation } from './layout/navigation';
import { footerSection } from './layout/footer';
import { findRoute, routes } from './routes';
import { getCurrentPath, initRouter, navigateTo, subscribe } from './state/router';
import { notFoundPage } from './pages/not-found';

function setDocumentTitle(path: string) {
  const match = findRoute(path);
  document.title = match ? `view-craft · ${match.label}` : 'view-craft · Not found';
}

function routingOutlet() {
  if (routes.length === 0) {
    return notFoundPage();
  }

  const [first, ...rest] = routes;

  let selection = when(
    () => getCurrentPath() === first.path,
    first.render()
  );

  for (const route of rest) {
    selection = selection.when(
      () => getCurrentPath() === route.path,
      route.render()
    );
  }

  return selection.else(notFoundPage());
}

export function appShell() {
  return div(
    { className: 'min-h-screen bg-slate-950 text-slate-100' },
    navigation(() => getCurrentPath(), navigateTo),
    main({ className: 'min-h-[calc(100vh-200px)] pb-20' }, routingOutlet()),
    footerSection()
  );
}

export function mountApp(target?: HTMLElement | null) {
  const resolvedTarget = target ?? (document.querySelector('#app') as HTMLElement | null) ?? undefined;

  subscribe(path => {
    setDocumentTitle(path);
  });

  setDocumentTitle(getCurrentPath());

  render(appShell(), resolvedTarget);

  initRouter();
}
