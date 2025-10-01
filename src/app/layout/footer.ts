export function footerSection() {
  return footer(
    { className: 'border-t border-slate-800/60 px-6 py-10' },
    div(
      { className: 'mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row' },
      span(() => `© ${new Date().getFullYear()} view-craft by Danilo Celestino de Castro. MIT licensed.`),
      span(
        'Built with view-craft and Vite · ',
        a(
          {
            href: 'https://github.com/dan2dev/view-craft',
            className: 'underline-offset-4 hover:underline',
            target: '_blank',
            rel: 'noreferrer',
          },
          'Contribute on GitHub'
        )
      )
    )
  );
}
