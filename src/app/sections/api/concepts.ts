export function conceptsSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold', style: 'color: var(--text-primary);' }, 'Core concepts'),
    ul(
      { className: 'grid gap-4 text-base md:grid-cols-2', style: 'color: var(--text-secondary);' },
      li(
        strong('Explicit updates · '),
        'Mutate everything you need, then call update() once for deterministic rendering.'
      ),
      li(
        strong('Reactive functions · '),
        'Wrap text or attributes in zero-arg functions so they recompute every update().'
      ),
      li(
        strong('when() · '),
        'Chain when(...).else(...) blocks to express state machines without remount churn.'
      ),
      li(
        strong('list() · '),
        'Render arrays by identity and reuse DOM nodes; mutate in place to keep references stable.'
      )
    )
  );
}
