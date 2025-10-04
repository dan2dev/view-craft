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
        className: "mb-8",
      }, 'Debugging and diagnostics'),
      ul(
        {
          className: "space-y-3 list-none pl-0",
        },
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-lg",
          }, '🔍'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Inspect the DOM markers like <!-- list-start --> when debugging list() behaviour.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-lg",
          }, '📝'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Console.log inside reactive functions to confirm when updates execute.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-lg",
          }, '⏸️'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Keep a breakpoint at update() to freeze-frame the state you are about to paint.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-lg",
          }, '⚠️'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'If content is stale, confirm update() actually fires after your mutations.')
        ),
      )
    )
  );
}
