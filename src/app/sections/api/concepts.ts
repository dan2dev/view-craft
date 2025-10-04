export function conceptsSection() {
  return section(
    {
      className: "py-20 bg-white border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-4xl",
      },
      h2({
        className: "mb-8",
      }, 'Core concepts'),
      ul(
        {
          className: "space-y-4 list-none pl-0",
        },
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, 'Explicit updates · '),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Mutate everything you need, then call update() once for deterministic rendering.')
        ),
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, 'Reactive functions · '),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Wrap text or attributes in zero-arg functions so they recompute every update().')
        ),
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, 'when() · '),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Chain when(...).else(...) blocks to express state machines without remount churn.')
        ),
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, 'list() · '),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Render arrays by identity and reuse DOM nodes; mutate in place to keep references stable.')
        )
      )
    )
  );
}
