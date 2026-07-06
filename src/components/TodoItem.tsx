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
  isPast?: boolean;
  isPastTime?: boolean;
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

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit, isPast, isPastTime }) => {
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
      <div className="flex flex-col mb-2">
        <h3 className={cn("text-lg font-bold pr-8", todo.completed && "line-through opacity-70")}>
          {todo.title}
        </h3>
      </div>
      
      {todo.description && (
        <p className={cn("text-sm opacity-80 leading-relaxed mb-4", todo.completed && "line-through")}>
          {todo.description}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Button Hoàn thành */}
          <button
            onClick={() => !isPast && !todo.completed && onToggle(todo.id, false)}
            disabled={isPast || todo.completed}
            className={cn(
              'text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5',
              todo.completed
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-white/60 text-slate-600 hover:bg-white',
              isPast && !todo.completed ? 'opacity-40 cursor-not-allowed' : ''
            )}
          >
            <Check size={14} /> Hoàn thành
          </button>
          
          {/* Button Chưa hoàn thành */}
          <button
            onClick={() => !isPast && todo.completed && onToggle(todo.id, true)}
            disabled={isPast || !todo.completed}
            className={cn(
              'text-xs font-bold px-4 py-2 rounded-full transition-all',
              !todo.completed
                ? (isPast ? 'bg-red-100 text-red-600 border border-red-200 opacity-60' : 'bg-rose-500 text-white shadow-md shadow-rose-500/30')
                : 'bg-white/60 text-slate-600 hover:bg-white',
              isPast && todo.completed ? 'opacity-40 cursor-not-allowed' : ''
            )}
          >
            Chưa hoàn thành
          </button>
        </div>

        {!isPast && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(todo)}
              className="p-2 bg-white/40 hover:bg-white/80 rounded-full transition-colors text-slate-800 backdrop-blur-sm"
            >
              <Edit size={16} />
            </button>
            {!isPastTime && (
              <button
                onClick={handleDelete}
                className="p-2 bg-white/40 hover:bg-white/80 rounded-full transition-colors text-red-600 backdrop-blur-sm"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
