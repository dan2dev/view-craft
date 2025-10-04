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
        "A few tips to keep your code happy and your browser from having an existential crisis."
      ),
      div(
        {
          className: "space-y-6",
        },
        div(
          {
            className: "bg-white rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Batch Updates'),
          p({
            className: "text-sm text-vc-secondary mb-2",
          }, 'Mutate like you\'re stress-testing the array, then update once like you meant to do that:'),
          div({
            className: "text-xs text-vc-muted font-mono bg-vc-bg p-3 rounded",
          }, '// Galaxy brain\nitems.push(item1);\nitems.push(item2);\nitems.sort();\nupdate();')
        ),
        div(
          {
            className: "bg-white rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Object Identity for Lists'),
          p({
            className: "text-sm text-vc-secondary",
          }, 'Lists track items by reference. Mutate the object, not your soul. Spreading objects creates new references and kills your DOM elements.')
        ),
        div(
          {
            className: "bg-white rounded-vc-card p-6 border border-vc-border",
          },
          h3({
            className: "text-base font-semibold mb-3",
          }, 'Use .else() for Clarity'),
          p({
            className: "text-sm text-vc-secondary",
          }, 'Even if not initially needed, it makes your intent crystal clear. Future you will thank present you.')
        ),
      )
    ),
  );
}
