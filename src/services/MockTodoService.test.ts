import { describe, it, expect, beforeEach } from 'vitest';
import { createMockTodoService } from './MockTodoService';
import type { ITodoService } from './ITodoService';

describe('MockTodoService', () => {
  let service: ITodoService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Use 0ms delay for faster tests
    service = createMockTodoService(0);
  });

  describe('create', () => {
    it('should create a new todo with generated id and createdAt', async () => {
      const todo = await service.create({ title: 'Test Todo' });

      expect(todo).toMatchObject({
        title: 'Test Todo',
        completed: false,
      });
      expect(todo.id).toBeDefined();
      expect(todo.createdAt).toBeInstanceOf(Date);
    });

    it('should persist the todo to localStorage', async () => {
      await service.create({ title: 'Persisted Todo' });

      const stored = localStorage.getItem('todo-react:todos:v1');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe('Persisted Todo');
    });
  });

  describe('getAll', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await service.getAll();
      expect(todos).toEqual([]);
    });

    it('should return all created todos', async () => {
      await service.create({ title: 'Todo 1' });
      await service.create({ title: 'Todo 2' });
      await service.create({ title: 'Todo 3' });

      const todos = await service.getAll();

      expect(todos).toHaveLength(3);
      expect(todos.map((t) => t.title)).toEqual(['Todo 1', 'Todo 2', 'Todo 3']);
    });

    it('should restore Date objects from localStorage', async () => {
      await service.create({ title: 'Date Test' });

      // Create a new service instance to simulate fresh load
      const freshService = createMockTodoService(0);
      const todos = await freshService.getAll();

      expect(todos[0].createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return todo when found', async () => {
      const created = await service.create({ title: 'Find Me' });

      const found = await service.getById(created.id);

      expect(found).not.toBeNull();
      expect(found?.title).toBe('Find Me');
    });

    it('should return null when todo not found', async () => {
      const found = await service.getById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update todo title', async () => {
      const created = await service.create({ title: 'Original' });

      const updated = await service.update(created.id, { title: 'Updated' });

      expect(updated?.title).toBe('Updated');
    });

    it('should update todo completed status', async () => {
      const created = await service.create({ title: 'Complete Me' });

      const updated = await service.update(created.id, { completed: true });

      expect(updated?.completed).toBe(true);
    });

    it('should persist updates to localStorage', async () => {
      const created = await service.create({ title: 'Persist Update' });
      await service.update(created.id, { title: 'Updated Title' });

      const todos = await service.getAll();
      expect(todos[0].title).toBe('Updated Title');
    });

    it('should return null when updating non-existent todo', async () => {
      const result = await service.update('fake-id', { title: 'Nope' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete todo and return true', async () => {
      const created = await service.create({ title: 'Delete Me' });

      const result = await service.delete(created.id);

      expect(result).toBe(true);

      const todos = await service.getAll();
      expect(todos).toHaveLength(0);
    });

    it('should return false when deleting non-existent todo', async () => {
      const result = await service.delete('fake-id');
      expect(result).toBe(false);
    });

    it('should only delete the specified todo', async () => {
      const todo1 = await service.create({ title: 'Keep' });
      const todo2 = await service.create({ title: 'Delete' });

      await service.delete(todo2.id);

      const todos = await service.getAll();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo1.id);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle completed from false to true', async () => {
      const created = await service.create({ title: 'Toggle Me' });
      expect(created.completed).toBe(false);

      const toggled = await service.toggleComplete(created.id);

      expect(toggled?.completed).toBe(true);
    });

    it('should toggle completed from true to false', async () => {
      const created = await service.create({ title: 'Toggle Again' });
      await service.toggleComplete(created.id);

      const toggled = await service.toggleComplete(created.id);

      expect(toggled?.completed).toBe(false);
    });

    it('should persist toggle to localStorage', async () => {
      const created = await service.create({ title: 'Persist Toggle' });
      await service.toggleComplete(created.id);

      const todos = await service.getAll();
      expect(todos[0].completed).toBe(true);
    });

    it('should return null when toggling non-existent todo', async () => {
      const result = await service.toggleComplete('fake-id');
      expect(result).toBeNull();
    });
  });
});
