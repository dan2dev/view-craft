// Import view-craft from CDN (unpkg)
import 'https://unpkg.com/view-craft@latest/dist/view-craft.js';

// Demo Todo App
const { div, h1, h2, input, button, span, p, update, on, list, when } = window.ViewCraft || {};

// Check if ViewCraft loaded
if (!div) {
  document.getElementById('demo-app').innerHTML = `
    <div style="color: red; padding: 20px; text-align: center;">
      <p style="margin-bottom: 10px;">Demo could not load. The library may still be building.</p>
      <p style="font-size: 14px; color: #666;">Try: <code>npm install view-craft</code> to use it in your project!</p>
    </div>
  `;
  throw new Error('ViewCraft not loaded');
}

// Todo type
let todos = [];
let nextId = 1;
let filter = 'all';
let newTitle = '';

// Actions
function addTodo(title) {
  const t = title.trim();
  if (!t) return;
  todos.push({ id: nextId++, title: t, done: false });
  newTitle = '';
  update();
}

function removeTodo(id) {
  const i = todos.findIndex((t) => t.id === id);
  if (i >= 0) {
    todos.splice(i, 1);
    update();
  }
}

function toggleTodo(id, done) {
  const t = todos.find((x) => x.id === id);
  if (!t) return;
  t.done = typeof done === 'boolean' ? done : !t.done;
  update();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  update();
}

function setFilter(f) {
  filter = f;
  update();
}

// Derived
function remainingCount() {
  return todos.filter((t) => !t.done).length;
}

function completedCount() {
  return todos.filter((t) => t.done).length;
}

function filteredTodos() {
  if (filter === 'active') return todos.filter((t) => !t.done);
  if (filter === 'completed') return todos.filter((t) => t.done);
  return todos;
}

// Build the UI
const demoApp = div(
  {
    className: 'max-w-2xl mx-auto',
    style: { color: '#1f2937' }
  },

  // Header
  div(
    { className: 'bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-xl -mx-8 -mt-8' },
    h1('Todo List', {
      className: 'text-3xl font-bold text-white text-center mb-4',
    }),
    div(
      { className: 'flex gap-2' },
      input({
        type: 'text',
        placeholder: 'What needs to be done?',
        className: 'flex-1 px-4 py-2 rounded-lg border-2 border-transparent focus:border-white focus:outline-none',
        value: () => newTitle,
      },
        on('input', (e) => {
          newTitle = e.target.value;
          update();
        }),
        on('keydown', (e) => {
          if (e.key === 'Enter') {
            addTodo(newTitle);
          } else if (e.key === 'Escape') {
            newTitle = '';
            update();
          }
        })
      ),
      button({
        disabled: () => newTitle.trim().length === 0,
        className: () =>
          'px-6 py-2 rounded-lg font-semibold transition-all ' +
          (newTitle.trim().length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-indigo-600 hover:bg-indigo-50'),
      },
        'Add',
        on('click', () => addTodo(newTitle))
      ),
    ),
  ),

  // Controls
  when(
    () => todos.length > 0,
    div(
      { className: 'flex items-center justify-between p-4 border-b' },
      div(
        { className: 'flex items-center gap-3 text-sm text-gray-600' },
        div(() => `${remainingCount()} item${remainingCount() === 1 ? '' : 's'} left`),
        div('•'),
        div(() => `${completedCount()} completed`),
      ),
      div(
        { className: 'flex gap-2' },
        button({
          className: () =>
            'px-3 py-1 rounded-md text-sm font-medium transition-colors ' +
            (filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'),
        },
          'All',
          on('click', () => setFilter('all'))
        ),
        button({
          className: () =>
            'px-3 py-1 rounded-md text-sm font-medium transition-colors ' +
            (filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'),
        },
          'Active',
          on('click', () => setFilter('active'))
        ),
        button({
          className: () =>
            'px-3 py-1 rounded-md text-sm font-medium transition-colors ' +
            (filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'),
        },
          'Completed',
          on('click', () => setFilter('completed'))
        ),
      ),
      when(
        () => completedCount() > 0,
        button({
          className: 'px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium',
        },
          'Clear completed',
          on('click', clearCompleted)
        ),
      ),
    ),
  ),

  // List
  div(
    { className: 'p-4' },
    when(
      () => filteredTodos().length > 0,
      div(
        { className: 'space-y-2' },
        list(
          () => filteredTodos(),
          (todo, index) =>
            div({
              className: 'todo-item flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors',
            },
              input({
                type: 'checkbox',
                className: 'w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500',
                checked: () => !!todo.done,
              },
                on('change', (e) => {
                  const checked = e.target.checked;
                  toggleTodo(todo.id, checked);
                })
              ),
              div({
                className: () => 'flex-1 ' + (todo.done ? 'line-through text-gray-400' : 'text-gray-800'),
                title: () => todo.title,
              },
                span({ className: 'text-gray-400 mr-2' }, () => `${index + 1}.`),
                () => todo.title
              ),
              button({
                className: 'px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors',
                title: 'Delete todo',
              },
                'Delete',
                on('click', () => removeTodo(todo.id))
              ),
            )
        ),
      ),
    ).else(
      div({ className: 'text-center py-12 text-gray-400' }, 'No todos yet. Add one above!')
    ),
  ),
);

// Mount the demo
const demoRoot = document.getElementById('demo-app');
if (demoRoot) {
  const rendered = demoApp(demoRoot, 0);
  if (rendered instanceof Node) {
    demoRoot.appendChild(rendered);
  }
}
