import { navigateTo } from '../state/router';

export function notFoundPage() {
  return div(
    {
      className: "section min-h-[60vh] flex items-center justify-center",
    },
    div(
      {
        className: "container max-w-2xl text-center",
      },
      h2({
        className: "mb-4",
      }, 'Page not found'),
      p({
        className: "mb-8 text-xl",
      }, 'We could not find that section. Try heading back to the overview.'),
      a(
        {
          href: '#overview',
          className: "btn-primary no-underline inline-block",
        },
        on('click', event => {
          event.preventDefault();
          navigateTo('overview');
        }),
        'Return to overview'
      )
    )
  );
}
