import { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types/Todo';
import { Button } from './Button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedTitle = editValue.trim();
    if (trimmedTitle && trimmedTitle !== todo.title) {
      onEdit(todo.id, trimmedTitle);
    } else {
      setEditValue(todo.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-slate-500 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 bg-slate-700 border border-indigo-500 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 text-slate-100 cursor-pointer ${
            todo.completed ? 'line-through text-slate-400' : ''
          }`}
          title="Click to edit"
        >
          {todo.title}
        </span>
      )}
      <Button variant="danger" onClick={() => onDelete(todo.id)}>
        Delete
      </Button>
    </div>
  );
}
