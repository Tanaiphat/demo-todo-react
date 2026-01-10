import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/Todo';
import type { ITodoService } from './ITodoService';

const STORAGE_KEY = 'todo-react:todos:v1';

export function createMockTodoService(simulatedDelay = 100): ITodoService {
  const delay = (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, simulatedDelay));
  };

  const readFromStorage = (): Todo[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.map((todo: Todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    } catch {
      return [];
    }
  };

  const writeToStorage = (todos: Todo[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  };

  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  return {
    async getAll(): Promise<Todo[]> {
      await delay();
      return readFromStorage();
    },

    async getById(id: string): Promise<Todo | null> {
      await delay();
      const todos = readFromStorage();
      return todos.find((todo) => todo.id === id) || null;
    },

    async create(input: CreateTodoInput): Promise<Todo> {
      await delay();
      const todos = readFromStorage();

      const newTodo: Todo = {
        id: generateId(),
        title: input.title,
        completed: false,
        createdAt: new Date(),
      };

      todos.push(newTodo);
      writeToStorage(todos);

      return newTodo;
    },

    async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
      await delay();
      const todos = readFromStorage();
      const index = todos.findIndex((todo) => todo.id === id);

      if (index === -1) return null;

      const updatedTodo: Todo = {
        ...todos[index],
        ...input,
      };

      todos[index] = updatedTodo;
      writeToStorage(todos);

      return updatedTodo;
    },

    async delete(id: string): Promise<boolean> {
      await delay();
      const todos = readFromStorage();
      const initialLength = todos.length;
      const filtered = todos.filter((todo) => todo.id !== id);

      if (filtered.length === initialLength) return false;

      writeToStorage(filtered);
      return true;
    },

    async toggleComplete(id: string): Promise<Todo | null> {
      await delay();
      const todos = readFromStorage();
      const index = todos.findIndex((todo) => todo.id === id);

      if (index === -1) return null;

      todos[index] = {
        ...todos[index],
        completed: !todos[index].completed,
      };

      writeToStorage(todos);
      return todos[index];
    },
  };
}

export const mockTodoService = createMockTodoService();
