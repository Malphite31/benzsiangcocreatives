import React, { useState, useMemo } from 'react';
import { Project, ProjectType } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CalendarViewProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const projectTypeColors: Record<ProjectType, string> = {
    [ProjectType.GraphicDesign]: 'bg-blue-200 text-blue-800 border-blue-300',
    [ProjectType.VideoEditing]: 'bg-purple-200 text-purple-800 border-purple-300',
};

export const CalendarView: React.FC<CalendarViewProps> = ({ projects, onProjectClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const projectsByDate = useMemo(() => {
    const map = new Map<string, Project[]>();
    projects.forEach(p => {
      if (p.dueDate) {
        const dateKey = p.dueDate; // It's already YYYY-MM-DD
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(p);
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h3>
        <div className="flex space-x-2">
            <button onClick={() => changeMonth(-1)} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-5 h-5" /></button>
            <button onClick={() => changeMonth(1)} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 font-semibold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2"><span className="hidden sm:inline">{day}</span><span className="sm:hidden">{day.charAt(0)}</span></div>)}
      </div>
       <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dateKey = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const todaysProjects = projectsByDate.get(dateKey) || [];
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <div key={index} className="h-20 sm:h-24 border border-gray-100 dark:border-gray-700 rounded-md p-1 overflow-y-auto">
                <div className={`text-xs sm:text-sm w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white font-bold' : 'dark:text-gray-200'}`}>
                    {day}
                </div>
                <div className="mt-1 space-y-1">
                    {todaysProjects.map(project => (
                        <button 
                            key={project.id} 
                            onClick={() => onProjectClick(project)}
                            className={`w-full text-left text-xs p-1 rounded border truncate ${projectTypeColors[project.type]}`}
                            title={project.name}
                        >
                            {project.name}
                        </button>
                    ))}
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};