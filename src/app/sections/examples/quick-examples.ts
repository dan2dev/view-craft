import { getActiveExampleIndex, getExamples, selectExample } from '../../state/examples';
import { codeBlock } from '../../ui/code-block';

function exampleCard(example = getExamples()[0]) {
  const { title, summary, code } = example;

  return article(
    {
      className: "bg-vc-bg rounded-vc-card p-6 border border-vc-border",
    },
    div(
      {
        className: "mb-6",
      },
      h3({
        className: "text-xl mb-3 font-semibold",
      }, title),
      p({
        className: "text-sm text-vc-secondary",
      }, summary)
    ),
    codeBlock('ts', code)
  );
}

function activeExampleView(examples = getExamples()) {
  if (examples.length === 0) {
    return div(
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
    {
      className: "py-20 bg-vc-bgCard border-t border-vc-border",
    },
    div(
      {
        className: "container max-w-6xl",
      },
      h2({
        className: "mb-4",
      }, 'Quick Examples'),
      p({
        className: "mb-12 text-base text-vc-secondary",
      }, 'State is just plain data. Mutate it freely, call update() when ready. No subscriptions, no observables, no existential dread.'),
      div(
        {
          className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
        },
        div(
          {
            className: "lg:col-span-3 flex flex-col gap-3",
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
                className: "text-left px-4 py-3 rounded-vc-sm border-2 transition-all duration-200 flex items-center gap-3",
                style: () => {
                  const isActive = getActiveExampleIndex() === index;
                  return `
                    background: ${isActive ? `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)` : 'var(--vc-bgCard)'};
                    border-color: ${isActive ? accentColor : 'transparent'};
                  `;
                },
              },
              on('click', () => selectExample(index)),
              span(
                {
                  className: "font-mono font-bold",
                  style: `color: ${accentColor};`
                },
                `0${index + 1}`
              ),
              span({
                className: "font-medium text-vc-ink",
              }, title)
            );
          })
        ),
        div(
          {
            className: "lg:col-span-9",
          },
          activeExampleView(examples)
        )
      )
    )
  );
}
