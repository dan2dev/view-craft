import 'view-craft';
import './style.css';

type Feature = {
  title: string;
  description: string;
};

type Example = {
  title: string;
  summary: string;
  code: string;
};

const highlights: Feature[] = [
  {
    title: 'Zero magic',
    description: 'You call update() when ready. Batch mutations without guessing when the DOM will re-render.',
  },
  {
    title: 'DOM-first mindset',
    description: 'Work with native nodes directly—no virtual DOM, no JSX transform, just functions and elements.',
  },
  {
    title: 'Global API',
    description: 'All 140+ HTML and SVG helpers like div(), button(), and svg() are available once you import the library.',
  },
  {
    title: 'TypeScript brewed',
    description: 'Ship strongly typed tags and helpers plus IDE-friendly hints that cover every attribute.',
  },
];

const quickExamples: Example[] = [
  {
    title: 'Counter',
    summary: 'Increment and reset with explicit updates.',
    code: String.raw`
import 'view-craft';

let count = 0;

const app = div(
  h1(() => \`Count: \${count}\`),
  button('Increment', on('click', () => { count++; update(); })),
  button('Reset', on('click', () => { count = 0; update(); }))
);

render(app);
`,
  },
  {
    title: 'Todo list',
    summary: 'Mutate arrays and sync the DOM with list().',
    code: String.raw`
import 'view-craft';

type Todo = { id: number; text: string; done: boolean };

let todos: Todo[] = [];
let nextId = 1;
let input = '';

function addTodo() {
  if (!input.trim()) return;
  todos.push({ id: nextId++, text: input, done: false });
  input = '';
  update();
}

const app = div(
  input({ value: () => input }, on('input', e => { input = e.target.value; update(); })),
  button('Add', on('click', addTodo)),
  when(() => todos.length > 0,
    list(() => todos, todo =>
      div(
        input({ type: 'checkbox', checked: () => todo.done }, on('change', () => { todo.done = !todo.done; update(); })),
        span(() => todo.text)
      )
    )
  ).else(p('No todos yet!'))
);

render(app);
`,
  },
  {
    title: 'Search filter',
    summary: 'Keep derived data in simple functions and refresh when it changes.',
    code: String.raw`
import 'view-craft';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

let searchQuery = '';

function filteredUsers() {
  const q = searchQuery.toLowerCase();
  return users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
}

const app = div(
  input({
    type: 'search',
    placeholder: 'Search users...',
    value: () => searchQuery,
  }, on('input', e => { searchQuery = e.target.value; update(); })),
  when(() => filteredUsers().length > 0,
    list(() => filteredUsers(), user =>
      div({ className: 'user-card' }, h3(user.name), p(user.email))
    )
  ).else(p(() => \`No users found for "\${searchQuery}"\`))
);

render(app);
`,
  },
];

function codeBlock(language: string, snippet: string) {
  const content = snippet.trim();

  return pre(
    { className: 'overflow-x-auto rounded-xl bg-slate-950/70 p-4 ring-1 ring-slate-800/60 backdrop-blur' },
    code(
      {
        className: `block text-sm text-slate-200 language-${language}`,
      },
      content
    )
  );
}

const heroSection = header(
  { className: 'relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-24 sm:py-32' },
  div(
    { className: 'mx-auto flex max-w-4xl flex-col items-center text-center gap-6' },
    span({ className: 'rounded-full border border-slate-700/70 px-4 py-1 text-sm text-slate-300' }, 'View Craft · DOM-first UI library'),
    h1(
      { className: 'text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl' },
      'Build reactive UIs the explicit way'
    ),
    p(
      { className: 'max-w-2xl text-base text-slate-300 sm:text-lg' },
      'Use view-craft to assemble fast, reactive interfaces without a virtual DOM. Mutate state, call update(), and keep shipping.'
    ),
    div(
      { className: 'flex flex-wrap items-center gap-4' },
      a(
        {
          className: 'rounded-full bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/80',
          href: '#installation',
        },
        'Get started'
      ),
      a(
        {
          className: 'rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white',
          href: 'https://github.com/dan2dev/view-craft',
          target: '_blank',
          rel: 'noreferrer',
        },
        'Source on GitHub'
      )
    )
  )
);

const highlightSection = section(
  { id: 'why', className: 'px-6 py-20' },
  div(
    { className: 'mx-auto grid max-w-5xl gap-10 md:grid-cols-2' },
    div(
      { className: 'space-y-4' },
      h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Why view-craft?'),
      p(
        { className: 'text-base text-slate-300' },
        'Cut through framework ceremony and talk to the DOM directly. view-craft keeps your mental model inline with browser APIs while staying productive.'
      )
    ),
    div(
      { className: 'grid gap-6' },
      ...highlights.map(({ title, description }) =>
        article(
          { className: 'rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10 transition hover:border-slate-700' },
          h3({ className: 'text-lg font-semibold text-slate-50' }, title),
          p({ className: 'mt-2 text-sm text-slate-300' }, description)
        )
      )
    )
  )
);

const installationSection = section(
  { id: 'installation', className: 'px-6 py-20' },
  div(
    { className: 'mx-auto max-w-4xl space-y-8' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Installation'),
    p({ className: 'text-base text-slate-300' }, 'Install the package once, then import it globally to register every helper.'),
    codeBlock('bash', 'pnpm add view-craft'),
    p({ className: 'text-base text-slate-300' }, 'Need npm instead? Swap pnpm with your package manager of choice.'),
    h3({ className: 'text-xl font-semibold text-slate-200' }, 'Register globals'),
    codeBlock(
      'ts',
      String.raw`
import 'view-craft';

const counter = div(
  h1(() => 'Count: 0'),
  button('Increment', on('click', () => update()))
);

render(counter);
`
    )
  )
);

const typesSection = section(
  { id: 'typescript', className: 'px-6 py-20' },
  div(
    { className: 'mx-auto max-w-4xl space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'TypeScript setup'),
    p({ className: 'text-base text-slate-300' }, 'Enable intellisense for every tag and helper by extending your compiler settings.'),
    codeBlock(
      'json',
      String.raw`
{
  "compilerOptions": {
    "types": ["vite/client", "view-craft/types"]
  }
}
`
    ),
    p(
      { className: 'text-base text-slate-300' },
      'Alternatively, add /// <reference types="view-craft/types" /> to your vite-env.d.ts file.'
    )
  )
);

const examplesSection = section(
  { id: 'examples', className: 'px-6 py-20' },
  div(
    { className: 'mx-auto max-w-5xl space-y-8' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Quick examples'),
    p({ className: 'text-base text-slate-300' }, 'Every example keeps state as plain data and schedules a single update() call to reflect changes.'),
    div(
      { className: 'grid gap-8 lg:grid-cols-3' },
      ...quickExamples.map(({ title, summary, code }) =>
        article(
          { className: 'flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10' },
          div(
            { className: 'space-y-2' },
            h3({ className: 'text-lg font-semibold text-slate-50' }, title),
            p({ className: 'text-sm text-slate-300' }, summary)
          ),
          codeBlock('ts', code)
        )
      )
    )
  )
);

const conceptsSection = section(
  { id: 'concepts', className: 'px-6 py-20' },
  div(
    { className: 'mx-auto max-w-4xl space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Core concepts'),
    ul(
      { className: 'grid gap-4 text-base text-slate-300 md:grid-cols-2' },
      li(
        strong('Explicit updates: '),
        'Mutate all the things, then call update() once. Perfect for async flows or large batch changes.'
      ),
      li(
        strong('Reactive functions: '),
        'Wrap text or attributes in zero-arg functions so they run again whenever update() executes.'
      ),
      li(
        strong('when(): '),
        'Chain when(...).else(...) blocks for concise branching without remounting preserved DOM.'
      ),
      li(
        strong('list(): '),
        'Render arrays by identity to keep elements stable—mutate the original objects for instant DOM sync.'
      )
    )
  )
);

const bestPracticesSection = section(
  { id: 'practices', className: 'px-6 py-20' },
  div(
    { className: 'mx-auto max-w-4xl space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Best practices'),
    ul(
      { className: 'space-y-3 text-base text-slate-300' },
      li('Batch work, then call update() once. It keeps repaint budgets happy.'),
      li('Prefer mutating existing objects in lists so view-craft can reuse DOM nodes.'),
      li('Use .else() clauses to keep control flow obvious for future maintainers.'),
      li('Drop debug breakpoints right before update() to inspect state transitions.'),
      li('Need to integrate Tailwind utilities? Apply className strings—no build-time macros required.'),
    )
  )
);

const footerSection = footer(
  { className: 'px-6 pb-16 pt-10' },
  div(
    { className: 'mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row' },
    span('© ', new Date().getFullYear().toString(), ' view-craft. MIT licensed.'),
    span(
      'Built with view-craft and Vite · ',
      a(
        {
          href: 'https://github.com/dan2dev/view-craft',
          className: 'underline-offset-4 hover:underline',
          target: '_blank',
          rel: 'noreferrer',
        },
        'Contribute on GitHub'
      )
    )
  )
);

render(
  div(
    { className: 'min-h-screen bg-slate-950 text-slate-100' },
    heroSection,
    main(
      { className: 'space-y-12' },
      highlightSection,
      installationSection,
      typesSection,
      examplesSection,
      conceptsSection,
      bestPracticesSection
    ),
    footerSection
  )
);
