import React, { useState, useEffect } from 'react';
import type { TodoRequest, TodoResponse } from '../services/todoService';
import { X, Check } from 'lucide-react';
import { cn } from './TodoItem';

interface TodoFormProps {
  onSubmit: (todo: TodoRequest) => Promise<void>;
  editingTodo: TodoResponse | null;
  onCancelEdit: () => void;
  selectedDate?: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, editingTodo, onCancelEdit, selectedDate }) => {
  const getDefaultDateTime = (dateStr?: string) => {
    const now = new Date();
    if (dateStr) {
      const [y, m, d] = dateStr.split('-');
      now.setFullYear(parseInt(y), parseInt(m) - 1, parseInt(d));
    }
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState(getDefaultDateTime(selectedDate));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setTargetDate(editingTodo.targetDate || getDefaultDateTime(selectedDate));
    } else {
      setTitle('');
      setDescription('');
      setTargetDate(getDefaultDateTime(selectedDate));
    }
  }, [editingTodo, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: editingTodo ? editingTodo.completed : false,
        targetDate: targetDate || undefined,
      });
      if (!editingTodo) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#FDF8F0] w-full max-w-md p-6 rounded-3xl shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onCancelEdit}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-200/50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-slate-800 mb-6 mt-2">
          {editingTodo ? 'Cập nhật công việc' : 'Thêm công việc mới'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bạn muốn làm gì?"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả (Không bắt buộc)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chi tiết công việc..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Thời gian thực hiện</label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-4 mt-4 rounded-2xl font-bold text-white transition-all',
              !title.trim() || isSubmitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/30 active:scale-[0.98]'
            )}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={20} />
                {editingTodo ? 'Lưu thay đổi' : 'Tạo mới'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
