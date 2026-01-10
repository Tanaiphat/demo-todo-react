import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface TodoInputProps {
  onAdd: (title: string) => void;
  disabled?: boolean;
}

export function TodoInput({ onAdd, disabled = false }: TodoInputProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todoTitle = title.trim();
    if (todoTitle) {
      onAdd(todoTitle);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1">
        <Input
          value={title}
          onChange={setTitle}
          placeholder="What needs to be done?"
          disabled={disabled}
        />
      </div>
      <Button type="submit" disabled={disabled || !title.trim()}>
        Add
      </Button>
    </form>
  );
}
