import "./style.css";
import "view-craft";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "vc_todos_v1";

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((t) => ({
        id: Number(t.id),
        title: String(t.title ?? ""),
        done: Boolean(t.done),
      }))
      .filter((t) => !!t.title);
  } catch {
    return [];
  }
}

let todos: Todo[] = loadTodos();
let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
let filter: Filter = "all";
let newTitle = "";

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore storage errors
  }
}

function rerender() {
  save();
  update();
}

function addTodo(title: string) {
  const t = title.trim();
  if (!t) return;
  todos.push({ id: nextId++, title: t, done: false });
  newTitle = "";
  rerender();
}

function removeTodo(id: number) {
  const i = todos.findIndex((t) => t.id === id);
  if (i >= 0) {
    todos.splice(i, 1);
    rerender();
  }
}

function toggleTodo(id: number, done?: boolean) {
  const t = todos.find((x) => x.id === id);
  if (!t) return;
  t.done = typeof done === "boolean" ? done : !t.done;
  rerender();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  rerender();
}

function setFilter(f: Filter) {
  filter = f;
  rerender();
}

function remainingCount() {
  return todos.filter((t) => !t.done).length;
}

function completedCount() {
  return todos.filter((t) => t.done).length;
}

function filteredTodos(): Todo[] {
  if (filter === "active") return todos.filter((t) => !t.done);
  if (filter === "completed") return todos.filter((t) => t.done);
  return todos;
}

const root = document.getElementById("app") as HTMLElement;

const app = div(
  {
    className: "todo-app",
  },

  // Header
  div(
    {
      className: "todo-header",
    },
    h1("Todo List (view-craft)"),
    div(
      {
        className: "todo-input-row",
      },
      (el) => {
        const inputEl = el as HTMLInputElement;
        inputEl.placeholder = "What needs to be done?";
        if (inputEl.value !== newTitle) {
          inputEl.value = newTitle;
        }
        inputEl.className = "todo-input";
      },
      input(
        {
          placeholder: "What needs to be done?",
          className: "todo-input",
          value: () => newTitle,
        },
        // Imperative modifier to set placeholder, styles and keep value in sync
        (el) => {
          const inputEl = el;
          inputEl.placeholder = "What needs to be done?";
          if (inputEl.value !== newTitle) {
            inputEl.value = newTitle;
          }
          inputEl.className = "todo-input";
        },
        on("input", (e) => {
          newTitle = (e.target as HTMLInputElement).value ?? "";
          update();
        }),
        on("keydown", (e: any) => {
          if ((e as KeyboardEvent).key === "Enter") {
            addTodo(newTitle);
            // newTitle = "";
            // e.currentTarget.value = "";
            // update();
          } else if ((e as KeyboardEvent).key === "Escape") {
            newTitle = "";
            update();
          }
        }),
      ),
      button(
        {
          disabled: () => newTitle.trim().length === 0,
          className: () =>
            "todo-add-btn" +
            (newTitle.trim().length === 0 ? " is-disabled" : ""),
        },
        "Add",
        on("click", () => addTodo(newTitle)),
      ),
    ),
  ),

  // Controls
  when(
    () => todos.length > 0,
    div(
      {
        className: "todo-controls",
      },
      // Left: counters
      div(
        {
          className: "todo-counters",
        },
        div(
          () =>
            `${remainingCount()} item${remainingCount() === 1 ? "" : "s"} left`,
        ),
        div("•"),
        div(() => `${completedCount()} completed`),
      ),
      // Middle: filters
      div(
        {
          className: "todo-filters",
        },
        button(
          {
            className: () =>
              "todo-filter" + (filter === "all" ? " is-active" : ""),
          },
          "All",
          on("click", () => setFilter("all")),
        ),
        button(
          {
            className: () =>
              "todo-filter" + (filter === "active" ? " is-active" : ""),
          },
          "Active",
          on("click", () => setFilter("active")),
        ),
        button(
          {
            className: () =>
              "todo-filter" + (filter === "completed" ? " is-active" : ""),
          },
          "Completed",
          on("click", () => setFilter("completed")),
        ),
      ),
      // Right: clear completed
      when(
        () => completedCount() > 0,
        button(
          {
            className: "todo-clear-completed",
          },
          "Clear completed",
          on("click", clearCompleted),
        ),
      ),
    ),
  ),

  // List
  when(
    () => filteredTodos().length > 0,
    div(
      {
        className: "todo-list",
      },
      list(
        () => filteredTodos(),
        (todo) =>
          div(
            {
              className: "todo-item",
            },
            input(
              // Imperative modifier to set type, styles, and keep checked in sync
              (el: any) => {
                const inputEl = el as HTMLInputElement;
                inputEl.type = "checkbox";
                inputEl.checked = !!todo.done;
                inputEl.className = "todo-checkbox";
              },
              on("change", (e: any) => {
                const checked = (e.target as HTMLInputElement).checked;
                toggleTodo(todo.id, checked);
              }),
            ),
            div(
              {
                className: () => "todo-title" + (todo.done ? " is-done" : ""),
                title: () => todo.title,
              },
              () => todo.title,
            ),
            button(
              {
                className: "todo-delete-btn",
                title: "Delete todo",
              },
              "Delete",
              on("click", () => removeTodo(todo.id)),
            ),
          ),
      ),
    ),
  ).else(
    div(
      {
        className: "todo-empty",
      },
      "No todos yet. Add one above!",
    ),
  ),
)(root, 0);

root.appendChild(app as Node);
