import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/Todo';

export interface ITodoService {
  getAll(): Promise<Todo[]>;
  getById(id: string): Promise<Todo | null>;
  create(input: CreateTodoInput): Promise<Todo>;
  update(id: string, input: UpdateTodoInput): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
  toggleComplete(id: string): Promise<Todo | null>;
}
