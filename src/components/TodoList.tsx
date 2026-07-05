import React, { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import type { TodoResponse, TodoRequest } from '../services/todoService';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoResponse | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await todoService.getAllTodos();
      if (response.data) {
        setTodos(response.data);
      } else {
        setTodos(response as unknown as TodoResponse[]);
      }
    } catch (err: any) {
      setError('Không thể kết nối tới máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateOrUpdate = async (todoReq: TodoRequest) => {
    try {
      if (editingTodo) {
        await todoService.updateTodo(editingTodo.id, todoReq);
      } else {
        await todoService.createTodo(todoReq);
      }
      await fetchTodos();
      setEditingTodo(null);
      setIsFormOpen(false);
    } catch (err) {
      alert('Lưu công việc thất bại.');
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      const todoToUpdate = todos.find(t => t.id === id);
      if (!todoToUpdate) return;
      
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
      
      await todoService.updateTodo(id, {
        title: todoToUpdate.title,
        description: todoToUpdate.description,
        completed: !currentStatus
      });
    } catch (err) {
      await fetchTodos();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Xóa công việc thất bại.');
    }
  };

  const openEditForm = (todo: TodoResponse) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTodo(null);
    setIsFormOpen(false);
  };

  const days = [
    { day: 'CN', date: 5, active: true },
    { day: 'T2', date: 6, active: false },
    { day: 'T3', date: 7, active: false },
    { day: 'T4', date: 8, active: false },
    { day: 'T5', date: 9, active: false },
    { day: 'T6', date: 10, active: false },
    { day: 'T7', date: 11, active: false },
  ];

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#FDF8F0] pb-24 relative shadow-2xl">
      <div className="pt-12 px-6">
        <button className="p-2 -ml-2 mb-4 hover:bg-slate-200/50 rounded-full transition-colors">
          <ChevronLeft size={28} className="text-slate-800" />
        </button>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Hôm nay</h1>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-full text-sm shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-colors"
          >
            Thêm công việc
          </button>
        </div>
        
        <p className="text-slate-500 font-medium text-lg mb-8">Ngày làm việc hiệu quả, Bạn</p>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Tháng 4, 2020</h2>
        
        <div className="flex justify-between items-center mb-10 px-1">
          {days.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className={`text-sm font-medium ${item.active ? 'text-rose-500' : 'text-slate-500'}`}>
                {item.day}
              </span>
              <span className={`text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full ${item.active ? 'text-rose-500' : 'text-slate-800'}`}>
                {item.date}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full h-px border-t border-dashed border-slate-300 mb-8 relative">
          <span className="absolute -top-3 -left-2 text-xs font-bold text-slate-400 bg-[#FDF8F0] pr-2">9 SÁNG</span>
        </div>

        {error ? (
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl flex items-start gap-3 mb-6">
            <AlertCircle className="mt-0.5" />
            <p>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-teal-600">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Tuyệt vời! Bạn không có công việc nào tồn đọng.
          </div>
        ) : (
          <div className="space-y-6">
            {todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={openEditForm}
              />
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <TodoForm 
          onSubmit={handleCreateOrUpdate} 
          editingTodo={editingTodo}
          onCancelEdit={closeForm}
        />
      )}
    </div>
  );
};

export default TodoList;
