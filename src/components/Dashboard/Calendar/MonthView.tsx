import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import { CalendarDay } from './CalendarDay';

interface MonthViewProps {
  currentMonth: number;
  currentYear: number;
  displayMode: 'month' | 'week' | 'day';
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
  displayMode,
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
      {displayMode === 'month' && (
        <div className="grid grid-cols-7 gap-px bg-zinc-800/50 min-h-0 overflow-hidden">
          {dayNames.map((day) => (
            <div key={day} className="py-1 text-center text-white/50 font-medium text-xs border-b border-[#FFD700]/20">
              {day}
            </div>
          ))}
        </div>
      )}
      
      {displayMode === 'week' && (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-7 gap-px bg-zinc-800/50">
            {Array.from({ length: 7 }, (_, i) => {
              // Create a new date to avoid reference issues
              const today = new Date();
              const date = new Date(today.getTime());
              // Calculate the start of the week and add the day index
              date.setDate(today.getDate() - today.getDay() + i);
              return (
                <div key={i} className="p-2 text-center border-b border-[#FFD700]/20">
                  <div className="text-xs text-white/50 font-medium">{dayNames[i]}</div>
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    date.toDateString() === new Date().toDateString() 
                      ? 'bg-[#FFD700] text-black' 
                      : 'text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-24 gap-px bg-zinc-800/50 overflow-y-auto">
            {Array.from({ length: 24 }, (_, hour) => (
              <React.Fragment key={hour}>
                {Array.from({ length: 7 }, (_, day) => (
                  <div key={`${hour}-${day}`} className="h-12 border-b border-[#FFD700]/10 relative group hover:bg-white/5">
                    {hour === 0 && day === 0 && (
                      <div className="absolute -left-12 -top-3 text-xs text-white/40">12 AM</div>
                    )}
                    {hour === 12 && day === 0 && (
                      <div className="absolute -left-12 -top-3 text-xs text-white/40">12 PM</div>
                    )}
                    {hour !== 0 && hour !== 12 && day === 0 && (
                      <div className="absolute -left-12 -top-3 text-xs text-white/40">
                        {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {displayMode === 'day' && (
        <div className="flex flex-col h-full">
          <div className="p-2 text-center border-b border-[#FFD700]/20">
            <div className="text-xs text-white/50 font-medium">
              {selectedDate?.toLocaleDateString('default', { weekday: 'long' })}
            </div>
            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
              selectedDate?.toDateString() === new Date().toDateString() 
                ? 'bg-[#FFD700] text-black' 
                : 'text-white'
            }`}>
              {selectedDate?.getDate()}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="h-12 border-b border-[#FFD700]/10 relative group hover:bg-white/5">
                <div className="absolute -left-12 -top-3 text-xs text-white/40">
                  {hour === 0 ? '12 AM' : 
                   hour === 12 ? '12 PM' : 
                 hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {displayMode === 'month' && (
        <div className="flex-1 overflow-hidden min-h-0 border border-[#FFD700]/20 rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.1)]">
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
      )}
    </div>
  );
  
  // Helper function to format date as YYYY-MM-DD
  function formatDateString(date: Date): string {
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return new Date().toISOString().split('T')[0];
    }
  }
}