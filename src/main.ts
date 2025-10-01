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

type ApiItem = {
  name: string;
  signature: string;
  description: string;
  notes?: string;
};

type Pattern = {
  title: string;
  description: string;
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

const coreFunctions: ApiItem[] = [
  {
    name: 'update()',
    signature: 'update(): void',
    description: 'Flushes every reactive function registered in the tree. Call after mutating state.',
    notes: 'Batch several mutations and call update() once for predictable performance.',
  },
  {
    name: 'render()',
    signature: 'render(node: NodeChild, target?: HTMLElement): void',
    description: 'Mounts a node into the DOM. Defaults to #app when no target is supplied.',
    notes: 'Call once at startup; the returned tree stays live and responds to update().',
  },
  {
    name: 'list()',
    signature: 'list(provider, renderer)',
    description: 'Keeps DOM nodes in sync with an array based on object identity.',
    notes: 'Mutate the original array (push, splice, sort) and call update().',
  },
  {
    name: 'when()',
    signature: 'when(condition, ...content).when(...).else(...)',
    description: 'Declarative branching that only swaps DOM when the active branch changes.',
    notes: 'Perfect for loading + empty + ready states without unmount jitter.',
  },
  {
    name: 'on()',
    signature: "on(event: string, handler: (ev: Event) => void, options?)",
    description: 'Attaches listeners while preserving context and teardown automatically.',
    notes: 'Supports native options like passive or capture.',
  },
];

const advancedPatterns: Pattern[] = [
  {
    title: 'Nested structures',
    description: 'Compose layouts with when() and list() to keep DOM reuse automatic.',
    code: String.raw`
when(() => user.isLoggedIn,
  div(
    h1(() => \`Welcome, \${user.name}\`),
    list(() => user.notifications, n =>
      div(
        { className: () => n.read ? 'read' : '' },
        span(() => n.message)
      )
    )
  )
).else(
  div('Please log in')
);
`,
  },
  {
    title: 'Component helpers',
    description: 'Extract reusable functions that return nodes—no classes or hooks required.',
    code: String.raw`
function UserCard(user: User) {
  return div(
    { className: 'user-card' },
    img({ src: user.avatar }),
    h3(user.name),
    p(user.bio)
  );
}

list(() => users, user => UserCard(user));
`,
  },
  {
    title: 'Computed helpers',
    description: 'Derive values with plain functions and re-run them whenever update() fires.',
    code: String.raw`
function activeCount() {
  return todos.filter(todo => !todo.done).length;
}

div(
  () => \`\${activeCount()} remaining\`
);
`,
  },
];

function codeBlock(language: string, snippet: string) {
  const content = snippet.trim();

  return pre(
    { className: 'w-full overflow-x-auto rounded-xl bg-slate-950/70 p-4 ring-1 ring-slate-800/60 backdrop-blur' },
    code(
      {
        className: `block w-full text-sm leading-relaxed text-slate-200 language-${language}`,
      },
      content
    )
  );
}

function heroSection() {
  return header(
    { className: 'relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-24 sm:py-32' },
    div(
      { className: 'mx-auto flex max-w-4xl flex-col items-center gap-6 text-center' },
      span(
        { className: 'rounded-full border border-slate-700/70 px-4 py-1 text-sm text-slate-300' },
        'view-craft · DOM-first UI library'
      ),
      h1(
        { className: 'text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl' },
        'Build reactive UIs the explicit way'
      ),
      p(
        { className: 'max-w-2xl text-base text-slate-300 sm:text-lg' },
        'Mutate state, call update(), and ship interfaces without a virtual DOM in sight. view-craft keeps you close to browser primitives while staying productive.'
      ),
      div(
        { className: 'flex flex-wrap items-center justify-center gap-4' },
        a(
          {
            className: 'rounded-full bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/80',
            href: '#overview',
          },
          on('click', event => {
            event.preventDefault();
            navigateTo('overview');
          }),
          'Overview'
        ),
        a(
          {
            className: 'rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white',
            href: '#api',
          },
          on('click', event => {
            event.preventDefault();
            navigateTo('api');
          }),
          'API reference'
        ),
        a(
          {
            className: 'rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white',
            href: '#examples',
          },
          on('click', event => {
            event.preventDefault();
            navigateTo('examples');
          }),
          'Examples'
        )
      )
    )
  );
}

function highlightSection() {
  return section(
    { className: 'grid gap-6 md:grid-cols-2' },
    ...highlights.map(({ title, description }) =>
      article(
        { className: 'rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10 transition hover:border-slate-700' },
        h3({ className: 'text-lg font-semibold text-slate-50' }, title),
        p({ className: 'mt-2 text-sm text-slate-300' }, description)
      )
    )
  );
}

function installationSection() {
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

function typeSystemSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'TypeScript integration'),
    p({ className: 'text-base text-slate-300' }, 'Enable IDE hints for all 140+ tags by extending your compiler configuration.'),
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
    p({ className: 'text-base text-slate-300' }, 'Alternatively, add /// <reference types="view-craft/types" /> to vite-env.d.ts.'),
    p({ className: 'text-base text-slate-300' }, 'Strict mode is fully supported; lean on it when extending DOM helpers or creating custom utilities.')
  );
}

function conceptsSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Core concepts'),
    ul(
      { className: 'grid gap-4 text-base text-slate-300 md:grid-cols-2' },
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

function bestPracticesSection() {
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

function debuggingSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Debugging and diagnostics'),
    ul(
      { className: 'space-y-3 text-base text-slate-300' },
      li('Inspect the DOM markers like <!-- list-start --> when debugging list() behaviour.'),
      li('Console.log inside reactive functions to confirm when updates execute.'),
      li('Keep a breakpoint at update() to freeze-frame the state you are about to paint.'),
      li('If content is stale, confirm update() actually fires after your mutations.'),
    )
  );
}

function quickExamplesSection() {
  let activeIndex = 0;

  function setActive(index: number) {
    activeIndex = index;
    update();
  }

  function exampleCard(example: Example) {
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

  function activeExampleView() {
    let selection = when(() => activeIndex === 0, exampleCard(quickExamples[0]));

    for (let index = 1; index < quickExamples.length; index++) {
      selection = selection.when(() => activeIndex === index, exampleCard(quickExamples[index]));
    }

    return selection.else(exampleCard(quickExamples[0]));
  }

  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Quick examples'),
    p({ className: 'text-base text-slate-300' }, 'Every snippet keeps state as plain data and schedules a single update() call to reflect changes.'),
    div(
      { className: 'flex flex-col gap-6 lg:flex-row lg:gap-8' },
      div(
        { className: 'flex shrink-0 flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-3 shadow-lg shadow-black/10 lg:w-60' },
        ...quickExamples.map(({ title }, index) => {
          const activeClasses = 'ring-1 ring-slate-400/80 bg-slate-800/60 text-white';
          const idleClasses = 'text-slate-300 hover:bg-slate-900/60 hover:text-white';

          return button(
            {
              type: 'button',
              className: () =>
                `w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeIndex === index ? activeClasses : idleClasses
                }`,
            },
            on('click', () => setActive(index)),
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
        activeExampleView()
      )
    )
  );
}

function advancedPatternsSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Advanced patterns'),
    p({ className: 'text-base text-slate-300' }, 'Build richer UIs by composing helpers—no components or memo hoops required.'),
    div(
      { className: 'grid gap-8 md:grid-cols-2' },
      ...advancedPatterns.map(({ title, description, code }) =>
        article(
          { className: 'flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10' },
          div(
            { className: 'space-y-2' },
            h3({ className: 'text-lg font-semibold text-slate-50' }, title),
            p({ className: 'text-sm text-slate-300' }, description)
          ),
          codeBlock('ts', code)
        )
      )
    )
  );
}

function apiReferenceSection() {
  return section(
    { className: 'space-y-6' },
    h2({ className: 'text-3xl font-semibold text-slate-50' }, 'Core API surface'),
    p({ className: 'text-base text-slate-300' }, 'The essentials you will use every day. Each helper is globally registered after importing view-craft.'),
    div(
      { className: 'grid gap-6 md:grid-cols-2' },
      ...coreFunctions.map(({ name, signature, description, notes }) =>
        article(
          { className: 'space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-black/10' },
          h3({ className: 'text-lg font-semibold text-slate-50' }, name),
          codeBlock('ts', signature),
          p({ className: 'text-sm text-slate-300' }, description),
          notes
            ? p({ className: 'text-sm text-slate-400' }, notes)
            : null
        )
      )
    )
  );
}

function overviewPage() {
  return div(
    heroSection(),
    div(
      { className: 'mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16' },
      highlightSection(),
      installationSection(),
      bestPracticesSection()
    )
  );
}

function apiPage() {
  return div(
    { className: 'mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24' },
    typeSystemSection(),
    apiReferenceSection(),
    conceptsSection(),
    debuggingSection()
  );
}

function examplesPage() {
  return div(
    { className: 'mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24' },
    quickExamplesSection(),
    advancedPatternsSection()
  );
}

function notFoundPage() {
  return div(
    { className: 'mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-32 text-center' },
    h2({ className: 'text-4xl font-semibold text-slate-50' }, 'Page not found'),
    p({ className: 'text-base text-slate-300' }, 'We could not find that section. Try heading back to the overview.'),
    a(
      {
        href: '#overview',
        className: 'rounded-full bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/80',
      },
      on('click', event => {
        event.preventDefault();
        navigateTo('overview');
      }),
      'Return to overview'
    )
  );
}

type Route = {
  path: string;
  label: string;
  render: () => NodeModFn;
};

const routes: Route[] = [
  { path: 'overview', label: 'Overview', render: overviewPage },
  { path: 'api', label: 'API Reference', render: apiPage },
  { path: 'examples', label: 'Examples', render: examplesPage },
];

function resolveHash(hash: string) {
  const cleaned = hash.replace(/^#/, '').replace(/^\/+/, '');
  return cleaned || 'overview';
}

function setHash(path: string) {
  const formatted = `#${path}`;
  if (window.location.hash !== formatted) {
    window.location.hash = formatted;
  }
}

function applyDocumentTitle(path: string) {
  const match = routes.find(route => route.path === path);
  if (match) {
    document.title = `view-craft · ${match.label}`;
  } else {
    document.title = 'view-craft · Not found';
  }
}

let currentPath = resolveHash(window.location.hash);

if (!window.location.hash) {
  setHash(currentPath);
}

applyDocumentTitle(currentPath);

window.addEventListener('hashchange', () => {
  const nextPath = resolveHash(window.location.hash);
  if (nextPath === currentPath) {
    return;
  }

  currentPath = nextPath;
  applyDocumentTitle(currentPath);
  update();
});

function navigateTo(target: string) {
  const nextPath = resolveHash(target.startsWith('#') ? target : `#${target}`);

  if (nextPath === currentPath) {
    applyDocumentTitle(currentPath);
    setHash(currentPath);
    update();
    return;
  }

  currentPath = nextPath;
  applyDocumentTitle(currentPath);
  setHash(currentPath);
  update();
}

function routingOutlet() {
  return when(
    () => currentPath === 'overview',
    overviewPage()
  )
    .when(() => currentPath === 'api', apiPage())
    .when(() => currentPath === 'examples', examplesPage())
    .else(notFoundPage());
}

const navigation = nav(
  { className: 'sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur' },
  div(
    { className: 'mx-auto flex max-w-6xl items-center justify-between px-6 py-4' },
    a(
      {
        href: '#overview',
        className: 'text-lg font-semibold text-slate-100 transition hover:text-white',
      },
      on('click', event => {
        event.preventDefault();
        navigateTo('overview');
      }),
      'view-craft'
    ),
    div(
      { className: 'flex flex-wrap items-center gap-2' },
      ...routes.map(({ path, label }) => {
        const activeClass = 'rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow transition';
        const idleClass = 'rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white';

        const linkClass = () => (currentPath === path ? activeClass : idleClass);

        return a(
          {
            href: `#${path}`,
            className: linkClass,
          },
          on('click', event => {
            event.preventDefault();
            navigateTo(path);
          }),
          label
        );
      })
    )
  )
);

const footerSection = footer(
  { className: 'border-t border-slate-800/60 px-6 py-10' },
  div(
    { className: 'mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row' },
    span(() => `© ${new Date().getFullYear()} view-craft. MIT licensed.`),
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
    navigation,
    main({ className: 'min-h-[calc(100vh-200px)] pb-20' }, routingOutlet()),
    footerSection
  )
);
