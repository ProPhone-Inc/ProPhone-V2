import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import { CalendarDay } from './CalendarDay';

interface MonthViewProps {
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  events: any[];
  filters: any;
  onEventDrop?: (eventId: string, newDate: string) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  selectedDate,
  onDateSelect,
  events,
  filters,
  onEventDrop
}: MonthViewProps) {
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full min-h-0">
      <div className="grid grid-cols-7 gap-px bg-zinc-800/50 min-h-0">
        {dayNames.map((day) => (
          <div key={day} className="py-1 text-center text-white/50 font-medium text-xs border-b border-[#FFD700]/20">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 border border-[#FFD700]/20 rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.1)]">
        <CalendarDay
          currentMonth={currentMonth}
          currentYear={currentYear}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          events={events}
          filters={filters}
          onEventDrop={onEventDrop}
        />
      </div>
    </div>
  );
}