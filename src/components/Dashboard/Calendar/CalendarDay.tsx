import React from 'react';
import { Clock, Users } from 'lucide-react';

interface DragEvent extends React.DragEvent {
  dataTransfer: DataTransfer;
}

interface CalendarDayProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  events: any[];
  filters: any;
  onEventDrop?: (eventId: string, newDate: string) => void;
}

export function CalendarDay({
  currentMonth,
  currentYear,
  selectedDate,
  onDateSelect,
  events,
  filters,
  onEventDrop
}: CalendarDayProps) {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const today = new Date();

  const getEventsForDate = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => {
      // Only show events for today's date
      if (dateString !== today || event.date !== dateString) return false;
      if (!filters.eventTypes[event.type]) return false;
      
      const eventDate = new Date(dateString);
      const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
      if (isWeekend && !filters.showWeekends) return false;
      
      return true;
    });
  };

  const handleDragStart = (e: DragEvent, event: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      eventId: event.id,
      type: event.type
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, date: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (onEventDrop) {
      onEventDrop(data.eventId, date);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-px h-[calc(100%-3rem)]">
      {Array.from({ length: 42 }, (_, i) => {
        const dayNumber = i - firstDayOfMonth + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
        const date = new Date(currentYear, currentMonth, dayNumber);
        const dateString = date.toISOString().split('T')[0];
        const dayEvents = getEventsForDate(dateString);
        const isToday = 
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();

        return (
          <button
            key={i}
            onClick={() => isCurrentMonth && onDateSelect(date)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, dateString)}
            disabled={!isCurrentMonth}
            className={`
              h-full p-2 transition-all duration-200 relative group flex flex-col items-start
              ${isCurrentMonth
                ? 'hover:bg-[#FFD700]/10 hover:shadow-lg' 
                : 'bg-black/40 cursor-not-allowed'
              }
              ${isToday ? 'ring-2 ring-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]' : ''}
              border-[0.5px] border-[#FFD700]/20 hover:border-[#FFD700]/40
              transition-[border-color,box-shadow,transform]
              hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]
              hover:z-10
              min-h-[90px]
            `}
          >
            <div className="mb-1">
              <span className={`
              text-xs font-medium flex items-center space-x-2
              ${isCurrentMonth ? 'text-white' : 'text-white/30'}
              ${isToday ? 'text-[#FFD700] bg-[#FFD700]/10 px-1.5 py-0.5 rounded-full w-fit' : ''}
              `}>
              {isCurrentMonth ? dayNumber : ''}
              </span>
            </div>
            
            {dayEvents.length > 0 && ( 
              <div className="flex-1 w-full space-y-1 overflow-y-auto">
                {dayEvents
                  .sort((a, b) => {
                    if (a.isAllDay && !b.isAllDay) return -1;
                    if (!a.isAllDay && b.isAllDay) return 1;
                    return a.time.localeCompare(b.time);
                  })
                  .map((event, index) => (
                    <div
                      key={`${event.id}-${event.date}-${event.time}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e as DragEvent, event)}
                      className={`text-[10px] leading-none px-1.5 py-0.5 rounded-md flex items-center space-x-1 transition-all cursor-pointer whitespace-nowrap overflow-hidden shadow-sm hover:shadow-md
                        ${event.type === 'event' 
                          ? `bg-[#4285f4] text-white hover:bg-[#4285f4]/90 ${event.isAllDay ? 'border-l-4 border-[#4285f4] bg-[#4285f4]/10 text-[#4285f4] hover:bg-[#4285f4]/20' : ''}`
                          : event.type === 'out-of-office' 
                          ? 'bg-[#f4511e] text-white hover:bg-[#f4511e]/90'
                          : event.type === 'working-location' 
                          ? 'bg-[#0b8043] text-white hover:bg-[#0b8043]/90'
                          : event.status === 'Done' 
                          ? 'bg-[#0b8043] text-white hover:bg-[#0b8043]/90'
                          : event.status === 'In Progress' 
                          ? 'bg-[#f6bf26] text-white hover:bg-[#f6bf26]/90'
                          : 'bg-[#039be5] text-white hover:bg-[#039be5]/90'
                        }`}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        {!event.isAllDay && (
                          <span className="font-medium min-w-[40px]">{event.time}</span>
                        )}
                        <span className="flex-1 truncate max-w-[120px]">{event.title}</span>
                      </div>
                      {event.attendees?.length > 0 && (
                        <div className="flex items-center text-xs">
                          <Users className="w-2.5 h-2.5" />
                          <span>{event.attendees.length}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}