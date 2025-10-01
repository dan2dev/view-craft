import { navigateTo } from '../state/router';

export function notFoundPage() {
  return div(
    { className: 'mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-32 text-center' },
    h2({ className: 'text-4xl font-semibold', style: 'color: var(--text-primary);' }, 'Page not found'),
    p({ className: 'text-base', style: 'color: var(--text-secondary);' }, 'We could not find that section. Try heading back to the overview.'),
    a(
      {
        href: '#overview',
        className: 'rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition',
        style: 'background-color: var(--text-primary); color: var(--bg-primary);',
      },
      on('click', event => {
        event.preventDefault();
        navigateTo('overview');
      }),
      'Return to overview'
    )
  );
}
