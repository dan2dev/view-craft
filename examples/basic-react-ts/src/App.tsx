import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'

type Todo = {
  id: number;
  title: string;
  done: boolean;
}

type Filter = 'all' | 'active' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [nextId, setNextId] = useState(1)
  const [filter, setFilter] = useState<Filter>('all')
  const [newTitle, setNewTitle] = useState('')

  const addTodo = (title: string) => {
    const t = title.trim()
    if (!t) return
    setTodos((prev) => [...prev, { id: nextId, title: t, done: false }])
    setNextId((id) => id + 1)
    setNewTitle('')
  }

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTodo = (id: number, done?: boolean) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: typeof done === 'boolean' ? done : !t.done } : t,
      ),
    )
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }

  const remainingCount = todos.filter((t) => !t.done).length
  const completedCount = todos.filter((t) => t.done).length

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo(newTitle)
    } else if (e.key === 'Escape') {
      setNewTitle('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 className="text-3xl font-bold text-white text-center mb-4">Todo List</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-transparent focus:border-white focus:outline-none"
              value={newTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.currentTarget.value)}
              onKeyDown={onInputKeyDown}
            />
            <button
              disabled={newTitle.trim().length === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                newTitle.trim().length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
              onClick={() => addTodo(newTitle)}
            >
              Add
            </button>
          </div>
        </div>

        {todos.length > 0 && (
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div>
                {remainingCount} item{remainingCount === 1 ? '' : 's'} left
              </div>
              <div>•</div>
              <div>{completedCount} completed</div>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            {completedCount > 0 && (
              <button
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            )}
          </div>
        )}

        <div className="p-4">
          {filteredTodos.length > 0 ? (
            <div className="space-y-2">
              {filteredTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    checked={!!todo.done}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => toggleTodo(todo.id, e.currentTarget.checked)}
                  />
                  <div
                    className={`flex-1 ${
                      todo.done ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                    title={todo.title}
                  >
                    {index + 1} {todo.title}
                  </div>
                  <button
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete todo"
                    onClick={() => removeTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No todos yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
