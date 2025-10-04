export function debuggingSection() {
  return section(
    {
      className: "py-20 bg-vc-bg border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-4xl",
      },
      h2({
        className: "mb-4",
      }, 'Debugging'),
      p({
        className: "mb-8 text-base text-vc-secondary",
      }, 'Debugging view-craft is refreshingly simple. No time-travel debuggers, no DevTools extensions. Just good old-fashioned detective work.'),
      div(
        {
          className: "space-y-6",
        },
        div(
          {
            className: "bg-vc-bgCard rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Inspect Markers'),
          p({
            className: "text-sm text-vc-secondary",
          }, 'Open DevTools and stare at the DOM like it owes you money. You\'ll see comment markers like <!-- when-start-1 --> and <!-- list-start-2 -->. These are your breadcrumbs. Follow them to victory.')
        ),
        div(
          {
            className: "bg-vc-bgCard rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Common Issues'),
          ul(
            {
              className: "list-disc pl-6 space-y-2 text-sm text-vc-secondary",
            },
            li('Content not updating? Did you call update()? (Asking because 80% of the time, you didn\'t)'),
            li('Are your conditions/functions returning what you think they are? console.log() is your friend.'),
            li('List items not reusing elements? Stop spreading objects. Item references need to be stable.')
          )
        ),
        div(
          {
            className: "bg-vc-bgCard rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'The One True Debug Strategy'),
          p({
            className: "text-sm text-vc-secondary",
          }, 'Put a breakpoint at update(). That\'s it. That\'s the whole debugging strategy. You now know exactly when state changes get flushed to the DOM.')
        ),
      )
    )
  );
}
