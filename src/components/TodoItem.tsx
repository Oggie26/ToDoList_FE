import React, { useState } from 'react';
import { Check, Edit, Trash2 } from 'lucide-react';
import type { TodoResponse } from '../services/todoService';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TodoItemProps {
  todo: TodoResponse;
  onToggle: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: TodoResponse) => void;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const colors = [
  'bg-orange-100/80 text-orange-900 border-orange-200/50',
  'bg-blue-100/80 text-blue-900 border-blue-200/50',
  'bg-rose-100/80 text-rose-900 border-rose-200/50',
  'bg-emerald-100/80 text-emerald-900 border-emerald-200/50',
  'bg-purple-100/80 text-purple-900 border-purple-200/50'
];

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const colorClass = colors[todo.id % colors.length];

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  return (
    <div
      className={cn(
        'group flex flex-col p-5 mb-4 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden',
        todo.completed ? 'opacity-60 grayscale-[50%]' : '',
        colorClass,
        isDeleting && 'opacity-0 scale-95 pointer-events-none'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={cn("text-lg font-bold pr-16", todo.completed && "line-through opacity-70")}>
          {todo.title}
        </h3>
        
        <button
          onClick={() => onToggle(todo.id, todo.completed)}
          className={cn(
            'absolute top-5 right-5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors',
            todo.completed ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-800/30 text-transparent hover:border-slate-800'
          )}
        >
          <Check size={16} className={todo.completed ? 'opacity-100' : 'opacity-0'} />
        </button>
      </div>
      
      {todo.description && (
        <p className={cn("text-sm opacity-80 leading-relaxed pr-8", todo.completed && "line-through")}>
          {todo.description}
        </p>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 bg-white/40 hover:bg-white/80 rounded-full transition-colors text-slate-800 backdrop-blur-sm"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-white/40 hover:bg-white/80 rounded-full transition-colors text-red-600 backdrop-blur-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
