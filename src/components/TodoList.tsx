import React, { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import type { TodoResponse, TodoRequest } from '../services/todoService';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { Loader2, AlertCircle, Check } from 'lucide-react';

const getVNTime = (dateStr: string | undefined | null) => {
  if (!dateStr) return new Date();
  return new Date(dateStr);
};

const getVNDateString = (dateStr: string | undefined | null) => {
  const date = getVNTime(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(getVNDateString(new Date().toISOString()));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    const actionText = currentStatus ? 'CHƯA HOÀN THÀNH' : 'HOÀN THÀNH';
    if (!window.confirm(`Bạn có chắc chắn muốn đánh dấu ${actionText} công việc này?`)) return;

    try {
      const todoToUpdate = todos.find(t => t.id === id);
      if (!todoToUpdate) return;

      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));

      await todoService.updateTodo(id, {
        title: todoToUpdate.title,
        description: todoToUpdate.description,
        completed: !currentStatus,
        status: !currentStatus ? 'COMPLETED' : 'TODO'
      });
      showToast(`Đã đánh dấu ${actionText.toLowerCase()}!`);
    } catch (err) {
      alert('Cập nhật trạng thái thất bại.');
      await fetchTodos();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác!')) return;
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      showToast('Đã xóa công việc thành công!');
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
    const tDate = getVNDateString(t.dueDate || t.createdAt);
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
              const tDate = getVNDateString(t.dueDate || t.createdAt);
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
              .sort((a, b) => getVNTime(a.dueDate || a.createdAt).getTime() - getVNTime(b.dueDate || b.createdAt).getTime())
              .map((todo) => {
                const currentTaskTime = getVNTime(todo.dueDate || todo.createdAt);
                
                const currentHour = currentTaskTime.getHours();
                const minutes = currentTaskTime.getMinutes().toString().padStart(2, '0');
                const hour12 = currentHour % 12 || 12;
                const period = currentHour < 12 ? 'SÁNG' : (currentHour === 12 ? 'TRƯA' : (currentHour < 18 ? 'CHIỀU' : 'TỐI'));
                const timeString = `${hour12}:${minutes} ${period}`;
                
                const todayStr = getVNDateString(new Date().toISOString());
                const taskDateStr = getVNDateString(todo.dueDate || todo.createdAt);
                const isPast = taskDateStr < todayStr;
                
                const isPastTime = getVNTime(todo.dueDate || todo.createdAt).getTime() < Date.now();

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
                      isPast={isPast}
                      isPastTime={isPastTime}
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

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
          <Check size={18} />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default TodoList;
