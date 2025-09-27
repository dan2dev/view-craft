import "./style.css";
import { render } from "solid-js/web";
import { createSignal, createMemo, For, Show } from "solid-js";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";

function App() {
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [nextId, setNextId] = createSignal(1);
  const [filter, setFilter] = createSignal<Filter>("all");
  const [newTitle, setNewTitle] = createSignal("");

  const addTodo = (title: string) => {
    const t = title.trim();
    if (!t) return;
    setTodos(prev => [...prev, { id: nextId(), title: t, done: false }]);
    setNextId(prev => prev + 1);
    setNewTitle("");
  };

  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id: number, done?: boolean) => {
    setTodos(prev => prev.map(t => 
      t.id === id 
        ? { ...t, done: typeof done === "boolean" ? done : !t.done }
        : t
    ));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.done));
  };

  const remainingCount = createMemo(() => todos().filter(t => !t.done).length);
  const completedCount = createMemo(() => todos().filter(t => t.done).length);
  
  const filteredTodos = createMemo(() => {
    const currentFilter = filter();
    if (currentFilter === "active") return todos().filter(t => !t.done);
    if (currentFilter === "completed") return todos().filter(t => t.done);
    return todos();
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo(newTitle());
    } else if (e.key === "Escape") {
      setNewTitle("");
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <h1 class="dynamic-header">this is a header</h1>
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 class="text-3xl font-bold text-white text-center mb-4">Todo List</h1>
          <div class="flex gap-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              class="flex-1 px-4 py-2 rounded-lg border-2 border-transparent focus:border-white focus:outline-none"
              value={newTitle()}
              onInput={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              disabled={newTitle().trim().length === 0}
              class={`px-6 py-2 rounded-lg font-semibold transition-all ${
                newTitle().trim().length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-indigo-50"
              }`}
              onClick={() => addTodo(newTitle())}
            >
              Add
            </button>
          </div>
        </div>

        {/* Controls */}
        <Show when={todos().length > 0}>
          <div class="flex items-center justify-between p-4 border-b">
            {/* Left counters */}
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <div>{remainingCount()} item{remainingCount() === 1 ? "" : "s"} left</div>
              <div>•</div>
              <div>{completedCount()} completed</div>
            </div>
            
            {/* Middle: filters */}
            <div class="flex gap-2">
              <button
                class={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter() === "all" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                class={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter() === "active" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                class={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter() === "completed" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
            
            {/* Right: clear completed */}
            <Show when={completedCount() > 0}>
              <button
                class="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </Show>
          </div>
        </Show>

        {/* List section */}
        <div class="p-4">
          <Show
            when={filteredTodos().length > 0}
            fallback={
              <div class="text-center py-12 text-gray-400">
                No todos yet. Add one above!
              </div>
            }
          >
            <div class="space-y-2">
              <For each={filteredTodos()}>
                {(todo, index) => (
                  <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      class="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      checked={todo.done}
                      onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                    />
                    <div
                      class={`flex-1 ${todo.done ? "line-through text-gray-400" : "text-gray-800"}`}
                      title={todo.title}
                    >
                      {index() + 1}{todo.title}
                    </div>
                    <button
                      class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete todo"
                      onClick={() => removeTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}

render(() => <App />, document.getElementById("app")!);