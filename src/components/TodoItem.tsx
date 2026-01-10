import type { Todo } from '../types/Todo';
import { Button } from './Button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-slate-500 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
      />
      <span
        className={`flex-1 text-slate-100 ${
          todo.completed ? 'line-through text-slate-400' : ''
        }`}
      >
        {todo.title}
      </span>
      <Button variant="danger" onClick={() => onDelete(todo.id)}>
        Delete
      </Button>
    </div>
  );
}
