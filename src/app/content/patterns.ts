import type { Pattern } from '../types/content';

export const advancedPatterns: Pattern[] = [
  {
    title: 'Nested structures',
    description: 'Combine when() and list() like you\'re building with LEGO blocks. DOM reuse happens automatically.',
    code: String.raw`
when(() => user.isLoggedIn,
  div(
    h1(() => \`Welcome, \${user.name}\`),
    list(() => user.notifications, n =>
      div(
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
    title: 'Component-like functions',
    description: 'Just functions that return DOM nodes. No classes, no hooks, no existential crisis.',
    code: String.raw`
function UserCard(user: User) {
  return div(
    img({ src: user.avatar }),
    h3(user.name),
    p(user.bio)
  );
}

list(() => users, user => UserCard(user));
`,
  },
  {
    title: 'Computed values',
    description: 'Plain functions that compute things. They run when update() fires. Mind-blowing stuff.',
    code: String.raw`
function activeCount() {
  return todos.filter(todo => !todo.done).length;
}

div(
  () => \`\${activeCount()} remaining\`
);
`,
  },
  {
    title: 'Loading states & async',
    description: 'Mark as loading, await your async chaos, update when done. You\'re the orchestrator of this symphony.',
    code: String.raw`
let state = { status: 'idle', data: [] };

async function fetchData() {
  state.status = 'loading';
  update();

  try {
    const response = await fetch('/api/data');
    state = { status: 'idle', data: await response.json() };
  } catch (error) {
    state = { status: 'error', data: [], error };
  }

  update();
}

const app = div(
  button('Load data', on('click', fetchData)),
  when(() => state.status === 'loading', div('Loading...'))
    .when(() => state.status === 'error', div('Error loading data'))
    .else(list(() => state.data, item => div(item.name)))
);

render(app);
`,
  },
];
