import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTodos } from './useTodos';
import type { ITodoService } from '../services/ITodoService';
import type { Todo } from '../types/Todo';

const createMockService = (initialTodos: Todo[] = []): ITodoService => {
  let todos = [...initialTodos];

  return {
    getAll: vi.fn(async () => [...todos]),
    getById: vi.fn(async (id) => todos.find((t) => t.id === id) || null),
    create: vi.fn(async (input) => {
      const newTodo: Todo = {
        id: `${Date.now()}`,
        title: input.title,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);
      return newTodo;
    }),
    update: vi.fn(async (id, input) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return null;
      todos[index] = { ...todos[index], ...input };
      return todos[index];
    }),
    delete: vi.fn(async (id) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return false;
      todos.splice(index, 1);
      return true;
    }),
    toggleComplete: vi.fn(async (id) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return null;
      todos[index] = { ...todos[index], completed: !todos[index].completed };
      return todos[index];
    }),
  };
};

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty todos', () => {
      const mockService = createMockService();
      const { result } = renderHook(() => useTodos(mockService));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.todos).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should fetch todos on mount and set loading to false', async () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          title: 'Test Todo',
          completed: false,
          createdAt: new Date(),
        },
      ];
      const mockService = createMockService(existingTodos);

      const { result } = renderHook(() => useTodos(mockService));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe('Test Todo');
      expect(mockService.getAll).toHaveBeenCalledOnce();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo to the list', async () => {
      const mockService = createMockService();
      const { result } = renderHook(() => useTodos(mockService));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.todos.length;

      await act(async () => {
        await result.current.addTodo('New Todo');
      });

      expect(result.current.todos).toHaveLength(initialLength + 1);
      expect(result.current.todos[result.current.todos.length - 1].title).toBe(
        'New Todo'
      );
      expect(mockService.create).toHaveBeenCalledWith({ title: 'New Todo' });
    });
  });

  describe('toggleTodo', () => {
    it('should toggle the completed status of a todo', async () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          title: 'Toggle Me',
          completed: false,
          createdAt: new Date(),
        },
      ];
      const mockService = createMockService(existingTodos);

      const { result } = renderHook(() => useTodos(mockService));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.todos[0].completed).toBe(false);

      await act(async () => {
        await result.current.toggleTodo('1');
      });

      expect(result.current.todos[0].completed).toBe(true);
      expect(mockService.toggleComplete).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteTodo', () => {
    it('should remove a todo from the list', async () => {
      const existingTodos: Todo[] = [
        {
          id: '1',
          title: 'Delete Me',
          completed: false,
          createdAt: new Date(),
        },
        { id: '2', title: 'Keep Me', completed: false, createdAt: new Date() },
      ];
      const mockService = createMockService(existingTodos);

      const { result } = renderHook(() => useTodos(mockService));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.todos).toHaveLength(2);

      await act(async () => {
        await result.current.deleteTodo('1');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe('2');
      expect(mockService.delete).toHaveBeenCalledWith('1');
    });
  });
});
