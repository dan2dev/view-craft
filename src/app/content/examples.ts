import type { Example } from '../types/content';

export const quickExamples: Example[] = [
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
      div(h3(user.name), p(user.email))
    )
  ).else(p(() => \`No users found for "\${searchQuery}"\`))
);

render(app);
`,
  },
];
