export function debuggingSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold', style: 'color: var(--text-primary);' }, 'Debugging and diagnostics'),
    ul(
      { className: 'space-y-3 text-base', style: 'color: var(--text-secondary);' },
      li('Inspect the DOM markers like <!-- list-start --> when debugging list() behaviour.'),
      li('Console.log inside reactive functions to confirm when updates execute.'),
      li('Keep a breakpoint at update() to freeze-frame the state you are about to paint.'),
      li('If content is stale, confirm update() actually fires after your mutations.'),
    )
  );
}
