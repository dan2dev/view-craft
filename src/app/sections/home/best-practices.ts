export function bestPracticesSection() {
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
      }, 'Best practices'),
      ul(
        {
          className: "space-y-3 list-none pl-0",
        },
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-xl font-bold",
          }, '✓'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Batch work, then call update() once. It keeps repaint budgets happy.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-xl font-bold",
          }, '✓'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Prefer mutating existing objects in lists so view-craft can reuse DOM nodes.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-xl font-bold",
          }, '✓'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Use .else() clauses to keep control flow obvious for future maintainers.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-xl font-bold",
          }, '✓'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Drop debug breakpoints right before update() to inspect state transitions.')
        ),
        li({
          className: "flex items-start gap-3 p-4 bg-white rounded-vc-card border border-vc-border",
        },
          span({
            className: "text-vc-accent text-xl font-bold",
          }, '✓'),
          span({
            className: "text-vc-secondary text-sm",
          }, 'Tailwind utilities work inline—no extra macros or compile steps needed.')
        ),
      )
    ),
  );
}
