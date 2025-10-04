export function conceptsSection() {
  return section(
    {
      className: "py-20 bg-vc-bgCard border-t border-vc-border",
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
      }, 'Four foundational ideas keep the API approachable while giving you precise control over rendering.'),
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
          }, 'ViewCraft never guesses when to re-render. You mutate your state however you like, then call update() once to commit the changes. No proxies, no dependency graphs, just deliberate rendering.'),
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
          }, 'Zero-argument functions become reactive bindings. Use them for text, attributes, and styles; they re-evaluate on every update() call to keep the DOM aligned with your data.'),
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
          }, 'Chain when(...).else(...) blocks to describe state transitions. The first truthy condition renders, and the associated DOM is preserved for snappy transitions.'),
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
          }, 'list() reconciles arrays by object identity rather than keys. Mutate your existing array, call update(), and ViewCraft reuses DOM nodes for stable, efficient lists.')
        )
      )
    )
  );
}
