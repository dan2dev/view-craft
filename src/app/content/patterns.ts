import type { Pattern } from '../types/content';

export const advancedPatterns: Pattern[] = [
  {
    title: 'Nested structures',
    description: 'Compose layouts with when() and list() to keep DOM reuse automatic.',
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
    title: 'Component helpers',
    description: 'Extract reusable functions that return nodes—no classes or hooks required.',
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
  {
    title: 'Async flows',
    description: 'Handle async work explicitly: mark loading, mutate state, call update() when promises settle.',
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
