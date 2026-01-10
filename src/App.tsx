import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';

function App() {
  const { todos, isLoading, error, addTodo, toggleTodo, deleteTodo } =
    useTodos();

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-400 text-center mb-8">
          To Do React
        </h1>

        <div className="mb-6">
          <TodoInput onAdd={addTodo} disabled={isLoading} />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-slate-400">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-slate-500">
            Your list is empty. Start by adding a task above!
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-slate-600 text-sm">
          {todos.length} {todos.length === 1 ? 'item' : 'items'}
        </div>
      </div>
    </div>
  );
}

export default App;
