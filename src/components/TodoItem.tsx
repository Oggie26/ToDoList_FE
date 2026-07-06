import React, { useState } from 'react';
import { Check, Edit, Trash2 } from 'lucide-react';
import type { TodoResponse } from '../services/todoService';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TodoItemProps {
  todo: TodoResponse;
  onUpdateStatus: (id: number, newStatus: TodoResponse['status']) => void;
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

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdateStatus, onDelete, onEdit, isPast, isPastTime }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompleted = todo.status === 'COMPLETED';
  const isNotDo = todo.status === 'NOT_DO';
  const isFinished = isCompleted || isNotDo;
  const colorClass = colors[todo.id % colors.length];

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  return (
    <div
      className={cn(
        'group flex flex-col p-5 mb-4 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden',
        isCompleted ? 'opacity-60 grayscale-[50%]' : '',
        colorClass,
        isDeleting && 'opacity-0 scale-95 pointer-events-none'
      )}
    >
      <div className="flex flex-col mb-2">
        <h3 className={cn("text-lg font-bold pr-8", isCompleted && "line-through opacity-70")}>
          {todo.title}
        </h3>
      </div>

      {todo.description && (
        <p className={cn("text-sm opacity-80 leading-relaxed mb-4", isCompleted && "line-through")}>
          {todo.description}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Button Hoàn thành */}
          <button
            onClick={() => !isPast && !isCompleted && onUpdateStatus(todo.id, 'COMPLETED')}
            disabled={isPast || isCompleted}
            className={cn(
              'text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5',
              isCompleted
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-white/60 text-slate-600 hover:bg-white',
              isPast && !isCompleted ? 'opacity-40 cursor-not-allowed' : ''
            )}
          >
            <Check size={14} /> Hoàn thành
          </button>

          <button
            onClick={() => !isPast && !isNotDo && onUpdateStatus(todo.id, 'NOT_DO')}
            disabled={isPast || isNotDo}
            className={cn(
              'text-xs font-bold px-4 py-2 rounded-full transition-all',
              isNotDo
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-white/60 text-slate-600 hover:bg-white',
              isPast && !isNotDo ? 'opacity-40 cursor-not-allowed' : ''
            )}
          >
            Chưa hoàn thành
          </button>
        </div>

        {!isPast && !isFinished && (
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
