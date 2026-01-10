import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types/Todo';
import type { ITodoService } from '../services/ITodoService';
import { mockTodoService } from '../services/MockTodoService';

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export function useTodos(
  service: ITodoService = mockTodoService
): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await service.getAll();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [service]);

  const addTodo = useCallback(
    async (title: string) => {
      try {
        setError(null);
        const newTodo = await service.create({ title });
        setTodos((prev) => [...prev, newTodo]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add todo');
      }
    },
    [service]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const updated = await service.toggleComplete(id);
        if (updated) {
          setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? updated : todo))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      }
    },
    [service]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const success = await service.delete(id);
        if (success) {
          setTodos((prev) => prev.filter((todo) => todo.id !== id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete todo');
      }
    },
    [service]
  );

  return {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
