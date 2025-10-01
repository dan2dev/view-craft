export function bestPracticesSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Best practices'),
    ul(
      { className: 'space-y-3 text-base text-slate-300' },
      li('Batch work, then call update() once. It keeps repaint budgets happy.'),
      li('Prefer mutating existing objects in lists so view-craft can reuse DOM nodes.'),
      li('Use .else() clauses to keep control flow obvious for future maintainers.'),
      li('Drop debug breakpoints right before update() to inspect state transitions.'),
      li('Tailwind utilities work inline—no extra macros or compile steps needed.'),
    )
  );
}
