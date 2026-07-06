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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await todoService.getAllTodos();
      const responseData = response.data as any;

      if (responseData) {
        if (responseData.content && Array.isArray(responseData.content)) {
          setTodos(responseData.content);
        } else if (Array.isArray(responseData)) {
          setTodos(responseData);
        } else {
          setTodos([]);
        }
      } else {
        setTodos(Array.isArray(response) ? (response as unknown as TodoResponse[]) : []);
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

  const getDaysOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = date.getDate() - day;
    const startOfWeek = new Date(date.setDate(diff));

    const days = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      days.push({
        day: dayNames[i],
        date: currentDate.getDate(),
        fullDate: dateString,
        active: dateString === selectedDate
      });
    }
    return days;
  };

  const filteredTodos = todos.filter(t => {
    const tDate = t.targetDate ? t.targetDate.split('T')[0] : (t.createdAt ? t.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
    return tDate === selectedDate;
  });

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#FDF8F0] pb-24 relative shadow-2xl">
      <div className="pt-12 px-6">
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

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Tháng {new Date(selectedDate).getMonth() + 1}, {new Date(selectedDate).getFullYear()}</h2>

        <div className="flex justify-between items-center mb-10 px-1">
          {getDaysOfWeek(selectedDate).map((item, idx) => {
            const taskCount = todos.filter(t => {
              const tDate = t.targetDate ? t.targetDate.split('T')[0] : (t.createdAt ? t.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
              return tDate === item.fullDate;
            }).length;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setSelectedDate(item.fullDate)}>
                <span className={`text-sm font-medium ${item.active ? 'text-rose-500' : 'text-slate-500'}`}>
                  {item.day}
                </span>
                <div className="relative">
                  <span className={`text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full transition-colors ${item.active ? 'text-white bg-rose-500 shadow-md shadow-rose-500/30' : 'text-slate-800 hover:bg-slate-200'}`}>
                    {item.date}
                  </span>
                  {taskCount > 0 && !item.active && (
                    <span className="absolute -top-0 -right-0 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-[#FDF8F0]"></span>
                  )}
                </div>
              </div>
            )
          })}
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
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Tuyệt vời! Bạn không có công việc nào trong ngày này.
          </div>
        ) : (
          <div className="relative border-l-2 border-dashed border-slate-300 ml-4 mt-6">
            {filteredTodos
              .sort((a, b) => new Date(a.targetDate || a.createdAt).getTime() - new Date(b.targetDate || b.createdAt).getTime())
              .map((todo, index, array) => {
                const currentTaskTime = new Date(todo.targetDate || todo.createdAt);
                
                const currentHour = currentTaskTime.getHours();
                const minutes = currentTaskTime.getMinutes().toString().padStart(2, '0');
                const hour12 = currentHour % 12 || 12;
                const period = currentHour < 12 ? 'SÁNG' : (currentHour === 12 ? 'TRƯA' : (currentHour < 18 ? 'CHIỀU' : 'TỐI'));
                const timeString = `${hour12}:${minutes} ${period}`;

                return (
                  <div key={todo.id} className="relative pl-6 pb-2">
                    <div className="absolute w-4 h-4 bg-teal-500 rounded-full -left-[9px] top-6 border-4 border-[#FDF8F0]"></div>
                    <div className="text-sm font-bold text-slate-500 mb-2 pt-1 pl-1">
                      {timeString}
                    </div>
                    <TodoItem
                      todo={todo}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={openEditForm}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {isFormOpen && (
        <TodoForm
          onSubmit={handleCreateOrUpdate}
          editingTodo={editingTodo}
          onCancelEdit={closeForm}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default TodoList;
