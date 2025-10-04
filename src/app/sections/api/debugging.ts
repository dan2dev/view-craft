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
      }, 'Debugging ViewCraft leans on the platform you already know. Inspect the DOM, trace your state changes, and you will quickly see where an update is missing.'),
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
          }, 'Open DevTools and inspect the ViewCraft markers such as <!-- when-start-1 --> and <!-- list-start-2 -->. They outline conditional and list boundaries so you can reason about what rendered.')
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
            li('Content not updating? Verify update() runs after your mutations.'),
            li('Check that your reactive functions return the expected values—console.log() or breakpoints help confirm.'),
            li('List items not reusing elements? Ensure you mutate existing objects so their references remain stable.')
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
          }, 'Set a breakpoint inside update() when you need clarity. Watching each invocation reveals exactly when changes flow to the DOM.')
        ),
      )
    )
  );
}
