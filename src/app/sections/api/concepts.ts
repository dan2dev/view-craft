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
        className: "mb-4",
      }, 'Core Concepts'),
      p({
        className: "mb-8 text-base text-vc-secondary",
      }, 'Four simple ideas that power the whole thing. No PhD required.'),
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
          }, '1. Explicit Updates'),
          p({
            className: "text-vc-secondary text-sm mt-2",
          }, 'Unlike frameworks that auto-detect changes, view-craft doesn\'t watch your every move. You call update() when ready. Mutate freely, then update once like a responsible adult. No proxies, no dependency graphs, no helicopter parents.')
        ),
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, '2. Reactive Functions'),
          p({
            className: "text-vc-secondary text-sm mt-2",
          }, 'Zero-arg functions become reactive. Pass () => `Count: ${count}` and it re-evaluates on every update(). Works for text, attributes, even styles. Revolutionary, we know.')
        ),
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, '3. Conditional Rendering with when()'),
          p({
            className: "text-vc-secondary text-sm mt-2",
          }, 'Chain when(...).else(...) blocks to build state machines. First matching condition wins. DOM is preserved if the active branch doesn\'t change. Low-key immortal.')
        ),
        li(
          {
            className: "p-5 bg-vc-bg rounded-vc-card border border-vc-border",
          },
          strong({
            className: "text-vc-primary text-base font-semibold",
          }, '4. List Synchronization'),
          p({
            className: "text-vc-secondary text-sm mt-2",
          }, 'Lists use object identity (not keys) to track items. Mutate the array (push, splice, reverse), then call update(). Elements are reused if the item reference is the same. Stop spreading objects like it\'s 2018.')
        )
      )
    )
  );
}
