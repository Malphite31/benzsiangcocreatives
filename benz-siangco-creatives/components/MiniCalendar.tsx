import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

interface MiniCalendarProps {
  projects: Project[];
  onNavigate: () => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ projects, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const projectsByDate = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach(p => {
      if (p.dueDate) {
        const dateKey = p.dueDate;
        map.set(dateKey, (map.get(dateKey) || 0) + 1);
      }
    });
    return map;
  }, [projects]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + offset);
        return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...blanks, ...days];
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
       <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h3>
        <div className="flex space-x-1">
            <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="w-8 h-8 mx-auto flex items-center justify-center">{day}</div>)}
      </div>
       <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dateKey = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const hasProject = projectsByDate.has(dateKey);
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <div key={index} className="w-8 h-8 mx-auto flex items-center justify-center relative">
               <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs ${isToday ? 'bg-primary-600 text-white font-bold' : 'dark:text-gray-200'}`}>
                {day}
               </span>
               {hasProject && <span className="absolute bottom-0.5 h-1 w-1 bg-blue-500 dark:bg-blue-400 rounded-full"></span>}
            </div>
          );
        })}
      </div>
      <button onClick={onNavigate} className="mt-4 w-full text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center">
          <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
          View Full Calendar
      </button>
    </div>
  );
};