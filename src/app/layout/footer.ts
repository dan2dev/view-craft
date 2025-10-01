export function footerSection() {
  return footer(
    { className: 'border-t px-6 py-10 transition-colors', style: 'border-color: var(--border-color);' },
    div(
      { className: 'mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm', style: 'color: var(--text-tertiary);' },
      span(() => `© ${new Date().getFullYear()} view-craft by Danilo Celestino de Castro. MIT licensed.`),
      span(
        'Built with view-craft · ',
        a(
          {
            href: 'https://github.com/dan2dev/view-craft',
            className: 'underline-offset-4 hover:underline cursor-pointer transition-colors duration-200',
            style: 'color: var(--emerald-secondary);',
            target: '_blank',
            rel: 'noreferrer',
          },
          'Contribute on GitHub'
        )
      )
    )
  );
}
