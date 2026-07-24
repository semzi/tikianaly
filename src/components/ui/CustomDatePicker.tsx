import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
} from 'date-fns';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onChange,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-base font-bold text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentMonth(subMonths(currentMonth, 1));
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-n3 rounded-full transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentMonth(addMonths(currentMonth, 1));
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-n3 rounded-full transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Monday start

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-xs text-gray-800 dark:text-gray-200 mb-2 w-8">
          {format(addDays(startDate, i), 'EEEEE')}
        </div>
      );
    }

    return <div className="flex justify-between">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isTodayDate = isToday(day);

        days.push(
          <button
            type="button"
            key={day.toString()}
            onClick={(e) => {
              e.preventDefault();
              onChange(cloneDay);
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs transition-colors
              ${
                !isCurrentMonth
                  ? 'text-gray-400 dark:text-gray-500'
                  : isSelected
                  ? 'bg-brand-secondary text-white font-bold shadow-md shadow-brand-secondary/30'
                  : isTodayDate
                  ? 'bg-black/50 text-white font-bold hover:bg-black/60 dark:hover:bg-black/60'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-n3'
              }
            `}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex justify-between mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div 
      className={`bg-white dark:bg-[#161B22] shadow-xl rounded-2xl p-4 w-[280px] border border-gray-100 dark:border-[#1F2937] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
