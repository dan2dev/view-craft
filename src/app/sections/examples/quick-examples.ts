import { getActiveExampleIndex, getExamples, selectExample } from '../../state/examples';
import { codeBlock } from '../../ui/code-block';

function exampleCard(example = getExamples()[0]) {
  const { title, summary, code } = example;

  return article(
    { className: 'flex w-full flex-col gap-4 rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl', style: 'background-color: var(--section-card-bg); border-color: var(--section-card-border);' },
    div(
      { className: 'space-y-2' },
      h3({ className: 'text-lg font-semibold', style: 'color: var(--text-primary);' }, title),
      p({ className: 'text-sm leading-relaxed', style: 'color: var(--text-secondary);' }, summary)
    ),
    codeBlock('ts', code)
  );
}

function activeExampleView(examples = getExamples()) {
  if (examples.length === 0) {
    return div(
      { className: 'rounded-2xl border p-6 text-sm', style: 'background-color: var(--section-card-bg); border-color: var(--section-card-border); color: var(--text-secondary);' },
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
    h2({ className: 'text-3xl font-semibold', style: 'color: var(--text-primary);' }, 'Quick examples'),
    p({ className: 'text-base', style: 'color: var(--text-secondary);' }, 'Every snippet keeps state as plain data and schedules a single update() call to reflect changes.'),
    div(
      { className: 'flex flex-col gap-6 lg:flex-row lg:gap-8' },
      div(
        { className: 'flex shrink-0 flex-col gap-2 rounded-2xl border p-3 shadow-lg lg:w-60', style: 'background-color: var(--section-card-bg); border-color: var(--section-card-border);' },
        ...examples.map(({ title }, index) => {
          const activeStyle = 'background-color: var(--bg-tertiary); color: var(--text-primary);';
          const idleStyle = 'color: var(--text-secondary);';

          return button(
            {
              type: 'button',
              className: () => `w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer ${getActiveExampleIndex() === index ? 'ring-2' : 'hover:bg-opacity-50'}`,
              style: () => {
                const base = getActiveExampleIndex() === index ? activeStyle : idleStyle;
                return `${base} ${getActiveExampleIndex() === index ? 'ring-color: var(--emerald-border);' : ''}`;
              },
            },
            on('click', () => selectExample(index)),
            span(
              { className: 'block text-xs uppercase tracking-wide', style: 'color: var(--text-tertiary);' },
              `0${index + 1}`
            ),
            span({ className: 'mt-1 block text-base' }, title)
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
