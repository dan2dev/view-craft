export function footerSection() {
  return footer(
    {
      className: "bg-vc-footer-bg text-vc-footer-text py-12 border-t border-vc-border",
    },
    div(
      {
        className: "container flex flex-col md:flex-row justify-between items-center gap-4",
      },
      span({
        className: "text-vc-footer-text-muted text-sm",
      }, () => `© ${new Date().getFullYear()} ViewCraft by Danilo Celestino de Castro. MIT licensed.`),
      span(
        {
          className: "text-vc-footer-text-muted text-sm",
        },
        'Built with ViewCraft · ',
        a(
          {
            href: 'https://github.com/dan2dev/view-craft',
            target: '_blank',
            rel: 'noreferrer',
            className: "text-vc-footer-text hover:text-vc-accent transition-colors underline",
          },
          'Contribute on GitHub'
        )
      )
    )
  );
}
