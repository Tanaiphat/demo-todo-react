export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export type CreateTodoInput = Pick<Todo, 'title'>;

export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;
