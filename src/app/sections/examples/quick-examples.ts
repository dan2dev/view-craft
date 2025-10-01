import { getActiveExampleIndex, getExamples, selectExample } from '../../state/examples';
import { codeBlock } from '../../ui/code-block';

function exampleCard(example = getExamples()[0]) {
  const { title, summary, code } = example;

  return article(
    { className: 'flex w-full flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10' },
    div(
      { className: 'space-y-2' },
      h3({ className: 'text-lg font-semibold text-slate-50' }, title),
      p({ className: 'text-sm text-slate-300' }, summary)
    ),
    codeBlock('ts', code)
  );
}

function activeExampleView(examples = getExamples()) {
  if (examples.length === 0) {
    return div(
      { className: 'rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 text-sm text-slate-300' },
      'Examples coming soon.'
    );
  }

  let selection = when(() => getActiveExampleIndex() === 0, exampleCard(examples[0]));

  for (let index = 1; index < examples.length; index++) {
    selection = selection.when(
      () => getActiveExampleIndex() === index,
      exampleCard(examples[index])
    );
  }

  return selection.else(exampleCard(examples[0]));
}

export function quickExamplesSection() {
  const examples = getExamples();

  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Quick examples'),
    p({ className: 'text-base text-slate-300' }, 'Every snippet keeps state as plain data and schedules a single update() call to reflect changes.'),
    div(
      { className: 'flex flex-col gap-6 lg:flex-row lg:gap-8' },
      div(
        { className: 'flex shrink-0 flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-3 shadow-lg shadow-black/10 lg:w-60' },
        ...examples.map(({ title }, index) => {
          const activeClasses = 'ring-1 ring-slate-400/80 bg-slate-800/60 text-white';
          const idleClasses = 'text-slate-300 hover:bg-slate-900/60 hover:text-white';

          return button(
            {
              type: 'button',
              className: () =>
                `w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  getActiveExampleIndex() === index ? activeClasses : idleClasses
                }`,
            },
            on('click', () => selectExample(index)),
            span(
              { className: 'block text-xs uppercase tracking-wide text-slate-400' },
              `0${index + 1}`
            ),
            span({ className: 'mt-1 block text-base text-inherit' }, title)
          );
        })
      ),
      div(
        { className: 'flex-1 min-w-0' },
        activeExampleView(examples)
      )
    )
  );
}
