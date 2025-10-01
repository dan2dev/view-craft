import { codeBlock } from '../../ui/code-block';

export function installationSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Install & register globals'),
    p({ className: 'text-base text-slate-300' }, 'Install view-craft once, then import it in your entry file to register every tag helper.'),
    codeBlock('bash', 'pnpm add view-craft'),
    p({ className: 'text-base text-slate-300' }, 'Need npm instead? Swap pnpm for your package manager of choice.'),
    h3({ className: 'text-xl font-semibold text-slate-200' }, 'Bootstrap your app'),
    codeBlock(
      'ts',
      String.raw`
import 'view-craft';

let count = 0;

const app = div(
  h1(() => \`Count: \${count}\`),
  button('Increment', on('click', () => { count++; update(); }))
);

render(app);
`
    )
  );
}
