import type { Pattern } from '../types/content';

export const advancedPatterns: Pattern[] = [
  {
    title: 'Nested structures',
    description: 'Compose when() and list() to model nested data flows while ViewCraft reuses DOM nodes for you.',
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
    description: 'Write plain functions that return DOM nodes, keeping behavior and markup close without extra abstractions.',
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
    description: 'Keep derived data in pure functions. They run as part of update() so your view stays in sync.',
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
    description: 'Track async progress with simple state flags, then render loading and error paths with when().',
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
