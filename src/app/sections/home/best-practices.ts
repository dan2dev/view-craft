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
        className: "mb-4",
      }, 'Best Practices'),
      p(
        {
          className: "mb-8 text-base text-vc-secondary",
        },
        "Keep ViewCraft fast and maintainable with a handful of habits that make updates predictable and easy to reason about."
      ),
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
          }, 'Batch Updates'),
          p({
            className: "text-sm text-vc-secondary mb-2",
          }, 'Group related mutations, then call update() once. The DOM syncs in a single pass:'),
          div({
            className: "text-xs text-vc-muted font-mono bg-vc-bg p-3 rounded",
          }, '// Galaxy brain\nitems.push(item1);\nitems.push(item2);\nitems.sort();\nupdate();')
        ),
        div(
          {
            className: "bg-vc-bgCard rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Object Identity for Lists'),
          p({
            className: "text-sm text-vc-secondary",
          }, 'list() reuses DOM nodes by object identity. Mutate existing items instead of recreating them so bindings stay intact.')
        ),
        div(
          {
            className: "bg-vc-bgCard rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Use .else() for Clarity'),
          p({
            className: "text-sm text-vc-secondary",
          }, '.else() completes the story of your conditional logic. Add it even when you only expect one branch so future states stay obvious.')
        ),
      )
    ),
  );
}
