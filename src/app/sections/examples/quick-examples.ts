import { getActiveExampleIndex, getExamples, selectExample } from '../../state/examples';
import { codeBlock } from '../../ui/code-block';

function exampleCard(example = getExamples()[0]) {
  const { title, summary, code } = example;

  return article(
    {
      className: 'flex w-full flex-col gap-4 border-2 p-7 transition-all duration-300',
      style: `
        background-color: var(--section-card-bg);
        border-color: var(--vc-accent-seafoam);
        border-radius: var(--vc-radius-xl);
        box-shadow: var(--vc-shadow-1);
      `
    },
    div(
      { className: 'space-y-2' },
      h3({ className: 'text-xl font-bold', style: 'color: var(--vc-color-primary-strong);' }, title),
      p({ className: 'text-sm leading-relaxed', style: 'color: var(--text-secondary);' }, summary)
    ),
    codeBlock('ts', code)
  );
}

function activeExampleView(examples = getExamples()) {
  if (examples.length === 0) {
    return div(
      {
        className: 'border p-6 text-sm',
        style: `
          background-color: var(--section-card-bg);
          border-color: var(--section-card-border);
          color: var(--text-secondary);
          border-radius: var(--vc-radius-lg);
        `
      },
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
        {
          className: 'flex shrink-0 flex-col gap-3 border-2 p-4 lg:w-64',
          style: `
            background: var(--vc-grad-panel);
            border-color: var(--vc-accent-mint);
            border-radius: var(--vc-radius-xl);
            box-shadow: var(--vc-shadow-1);
          `
        },
        ...examples.map(({ title }, index) => {
          const buttonColors = [
            'var(--vc-accent-mint)',
            'var(--vc-accent-seafoam)',
            'var(--vc-accent-sky)',
            'var(--vc-accent-peach)',
            'var(--vc-accent-coral)',
            'var(--vc-accent-teal)'
          ];
          const accentColor = buttonColors[index % buttonColors.length];

          return button(
            {
              type: 'button',
              className: () => `w-full px-4 py-3 text-left text-sm font-semibold transition-all cursor-pointer border-2 ${getActiveExampleIndex() === index ? 'scale-105' : 'hover:scale-102'}`,
              style: () => {
                const isActive = getActiveExampleIndex() === index;
                return `
                  background: ${isActive ? `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)` : 'transparent'};
                  color: ${isActive ? 'var(--text-primary)' : 'var(--text-secondary)'};
                  border-color: ${isActive ? accentColor : 'transparent'};
                  border-radius: var(--vc-radius-md);
                  ${isActive ? 'box-shadow: var(--vc-shadow-1);' : ''}
                `;
              },
            },
            on('click', () => selectExample(index)),
            span(
              { className: 'block text-xs font-bold uppercase tracking-wide', style: `color: ${accentColor};` },
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
