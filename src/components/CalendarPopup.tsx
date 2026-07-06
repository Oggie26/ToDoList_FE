import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { TodoResponse } from '../services/todoService';
import { cn } from './TodoItem';

interface CalendarPopupProps {
  selectedDate: string; // YYYY-MM-DD
  todos: TodoResponse[];
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const getVNDateString = (dateStr: string | undefined | null) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const CalendarPopup: React.FC<CalendarPopupProps> = ({ selectedDate, todos, onSelectDate, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(selectedDate));

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isToday = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return getVNDateString(d.toISOString()) === getVNDateString(new Date().toISOString());
  };

  const isSelected = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return getVNDateString(d.toISOString()) === selectedDate;
  };

  const hasTasks = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = getVNDateString(d.toISOString());
    return todos.some(t => getVNDateString(t.dueDate || t.createdAt) === dateStr);
  };

  const handleSelect = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelectDate(getVNDateString(d.toISOString()));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-200/50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-6 mt-2">
          <h3 className="text-xl font-bold text-slate-800">
            Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
          </h3>
          <div className="flex items-center gap-2 pr-8">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
            <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {paddingDays.map(p => (
            <div key={`pad-${p}`} className="h-10" />
          ))}
          {days.map(day => {
            const selected = isSelected(day);
            const today = isToday(day);
            const tasks = hasTasks(day);

            return (
              <div key={day} className="relative flex justify-center items-center h-10">
                <button
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all",
                    selected ? "bg-teal-600 text-white shadow-md shadow-teal-600/30" : 
                    today ? "bg-rose-100 text-rose-600" : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {day}
                </button>
                {tasks && !selected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-500"></span>
                )}
                {tasks && selected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;
