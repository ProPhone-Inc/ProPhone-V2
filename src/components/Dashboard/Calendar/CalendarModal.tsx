import React from 'react';
import { Plus, Users, Calendar, X, Filter, Clock, ChevronLeft, ChevronRight, AlertTriangle, Filter as FilterIcon } from 'lucide-react';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { TaskView } from './TaskView';
import { EventFormModal } from '../EventFormModal';

interface CalendarModalProps {
  onClose: () => void;
}

export function CalendarModal({ onClose }: CalendarModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'calendar' | 'tasks'>('calendar');
  const [showEventForm, setShowEventForm] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [isClosing, setIsClosing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [taskStages, setTaskStages] = React.useState(['To Do', 'In Progress', 'Done']);
  const [displayMode, setDisplayMode] = React.useState<'month' | 'week' | 'day' | '4day' | 'schedule'>('month');
  const [taskDisplayMode, setTaskDisplayMode] = React.useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const initialEventForm = {
    title: '',
    type: 'event' as 'event' | 'out-of-office' | 'working-location' | 'task',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    time: '',
    endTime: '',
    isAllDay: false,
    recurrence: 'none',
    location: '',
    videoConference: false,
    notifications: ['30'],
    description: '',
    attendees: '',
    attachments: []
  };
  const [eventForm, setEventForm] = React.useState(initialEventForm);

  // Clean up event listeners on unmount
  React.useEffect(() => {
    return () => {
      // Clean up any event listeners
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleEscapeKey = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !showEventForm) {
      handleClose();
    }
  }, [showEventForm]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Add escape key listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  const [localEvents, setLocalEvents] = React.useState([
    {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Welcome to Calendar',
      type: 'event',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      description: 'Click anywhere on the calendar to add a new event or task',
      attendees: []
    }
  ]);

  const events = localEvents;

  const [filters, setFilters] = React.useState({
    showWeekends: true,
    showDeclinedEvents: true,
    showCompletedTasks: true,
    showAppointments: true,
    eventTypes: {
      event: true,
      'out-of-office': true,
      'working-location': true,
      task: true
    }
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
    setCurrentYear(prev => prev - (currentMonth === 0 ? 1 : 0));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
    setCurrentYear(prev => prev + (currentMonth === 11 ? 1 : 0));
  };

  const handleEventDrop = (eventId: string, newDate: string) => {
    setLocalEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, date: newDate }
        : event
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!eventForm.title?.trim()) {
        throw new Error('Event title is required');
      }

      if (!eventForm.startDate) {
        throw new Error('Start date is required');
      }

      if (!eventForm.isAllDay && !eventForm.time) {
        throw new Error('Start time is required for non-all-day events');
      }

      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: eventForm.title,
        type: eventForm.type,
        date: eventForm.startDate,
        time: eventForm.isAllDay ? '00:00' : eventForm.time,
        endTime: eventForm.endTime,
        description: eventForm.description,
        location: eventForm.location,
        videoConference: eventForm.videoConference,
        notifications: eventForm.notifications,
        attendees: typeof eventForm.attendees === 'string' 
          ? eventForm.attendees.split(',').map(email => email.trim()).filter(Boolean)
          : eventForm.attendees || [],
        status: eventForm.type === 'task' ? 'To Do' : undefined,
        isAllDay: eventForm.isAllDay,
        recurrence: eventForm.recurrence
      };
      
      setLocalEvents(prev => [...prev, newEvent]);
      
      // Clear form and close modal
      setShowEventForm(false);
      setSelectedDate(new Date(eventForm.startDate));
      
      // Reset form
      setEventForm(initialEventForm);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update event when edited
  const handleEventEdit = (updatedEvent: any) => {
    setLocalEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  // Delete event
  const handleEventDelete = (eventId: string) => {
    setLocalEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setEventForm({
      ...initialEventForm,
      startDate: date.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0]
    });
    setShowEventForm(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`} 
        onClick={() => {
          if (!showEventForm) {
            handleClose();
          }
        }}
      />
      <div
        ref={modalRef}
        className="relative w-[1200px] h-[calc(100vh-6rem)] max-h-[800px] rounded-xl bg-zinc-900/70 backdrop-blur-xl border border-[#B38B3F]/30 shadow-2xl overflow-hidden flex flex-col"
      >
        <CalendarHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddEvent={() => {
            setEventForm({
              ...initialEventForm,
              startDate: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
              endDate: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
            });
            setShowEventForm(true);
          }}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          taskDisplayMode={taskDisplayMode}
          setTaskDisplayMode={setTaskDisplayMode}
          filters={filters}
          setFilters={setFilters}
          onClose={onClose}
        />

        <div className="relative h-[calc(100%-5rem)] overflow-hidden">
          <div className="p-4 overflow-y-auto relative h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-[#FFD700] transition-colors" />
                  </button>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={goToNextMonth}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-[#FFD700] transition-colors" />
                  </button>
                </div>
                <button
                  onClick={onAddEvent}
                  className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {viewMode === 'calendar' && (
                  <>
                    <div className="flex bg-zinc-800/50 rounded-lg p-0.5">
                      <button
                        onClick={() => setViewMode('calendar')}
                        className={`relative px-3 py-1.5 rounded-lg transition-colors text-xs ${
                          viewMode === 'calendar'
                            ? 'bg-[#FFD700]/90 text-black font-medium text-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/5 text-sm'
                        }
                        ${viewMode === 'calendar' ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#B38B3F]/0 after:via-[#FFD700]/50 after:to-[#B38B3F]/0 after:animate-[glow_4s_ease-in-out_infinite] after:shadow-[0_0_15px_rgba(255,215,0,0.3)]' : ''}`}
                      >
                        Calendar
                      </button>
                      <button
                        onClick={() => setViewMode('tasks')}
                        className={`relative px-3 py-1.5 rounded-lg transition-colors text-xs ${
                          viewMode === 'tasks'
                            ? 'bg-[#FFD700]/90 text-black font-medium text-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/5 text-sm'
                        }
                        ${viewMode === 'tasks' ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#B38B3F]/0 after:via-[#FFD700]/50 after:to-[#B38B3F]/0 after:animate-[glow_4s_ease-in-out_infinite] after:shadow-[0_0_15px_rgba(255,215,0,0.3)]' : ''}`}
                      >
                        Tasks
                      </button>
                    </div>
                    <button
                      className="px-2.5 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 text-white/80 text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{displayMode.charAt(0).toUpperCase() + displayMode.slice(1)}</span>
                    </button>
                    <button
                      className="px-2.5 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 text-white/80 text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <FilterIcon className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </>
                )}
                {viewMode === 'tasks' && (
                  <>
                    <div className="flex bg-zinc-800/50 rounded-lg p-0.5">
                      <button
                        onClick={() => setViewMode('calendar')}
                        className={`relative px-3 py-1.5 rounded-lg transition-colors text-xs ${
                          viewMode === 'calendar'
                            ? 'bg-[#FFD700]/90 text-black font-medium text-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/5 text-sm'
                        }`}
                      >
                        Calendar
                      </button>
                      <button
                        onClick={() => setViewMode('tasks')}
                        className={`relative px-3 py-1.5 rounded-lg transition-colors text-xs ${
                          viewMode === 'tasks'
                            ? 'bg-[#FFD700]/90 text-black font-medium text-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/5 text-sm'
                        }`}
                      >
                        Tasks
                      </button>
                    </div>
                    <button
                      className="px-2.5 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 text-white/80 text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{taskDisplayMode.charAt(0).toUpperCase() + taskDisplayMode.slice(1)}</span>
                    </button>
                  </>
                )}
              </div>
              </div>
              <div className="max-w-[1100px] mx-auto">
          {viewMode === 'tasks' ? (
            <TaskView
              taskStages={taskStages}
              setTaskStages={setTaskStages}
              events={events}
              taskDisplayMode={taskDisplayMode}
              selectedDate={selectedDate}
              onTaskSelect={(task) => {
                setEventForm({ ...task, startDate: task.date, endDate: task.date });
                setShowEventForm(true);
              }}
            />
          ) : (
            <MonthView
              currentMonth={currentMonth}
              currentYear={currentYear}
              setCurrentMonth={setCurrentMonth}
              setCurrentYear={setCurrentYear}
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setEventForm(prev => ({
                  ...prev,
                  startDate: date.toISOString().split('T')[0],
                  endDate: date.toISOString().split('T')[0]
                }));
                setShowEventForm(true);
              }}
              events={events}
              filters={filters}
              onEventDrop={handleEventDrop}
            /> 
          )}
            </div>
          </div>
          
          <div 
            className="absolute right-0 top-0 w-72 h-full bg-zinc-900/95 backdrop-blur-md border-l border-[#B38B3F]/20 transform transition-transform duration-300 translate-x-full hover:translate-x-0 group"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
              <div className="bg-zinc-900/95 backdrop-blur-md border border-[#B38B3F]/20 rounded-l-lg p-2 cursor-pointer transform transition-opacity duration-300 group-hover:opacity-0">
                <div className="writing-mode-vertical text-white/70 text-sm">
                  Events & Tasks
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto h-full">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedDate?.toLocaleDateString('default', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
            </div>
            
            <div className="space-y-4">
              {events
                ?.filter(event => event.date === selectedDate?.toISOString().split('T')[0])
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer
                      ${event.type === 'event' 
                        ? 'bg-[#FFD700]/10 border-[#FFD700]/20 hover:border-[#FFD700]/40' 
                        : event.type === 'out-of-office'
                        ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/20 hover:border-[#FF6B6B]/40'
                        : event.type === 'working-location'
                        ? 'bg-[#4CAF50]/10 border-[#4CAF50]/20 hover:border-[#4CAF50]/40'
                        : 'bg-[#2196F3]/10 border-[#2196F3]/20 hover:border-[#2196F3]/40'
                      }`}
                    onClick={() => {
                      setEventForm({ ...event, startDate: event.date, endDate: event.date });
                      setShowEventForm(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{event.title}</span>
                      <span className="text-white/60 text-sm">{event.time}</span>
                    </div>
                    {event.description && (
                      <p className="text-white/70 text-sm">{event.description}</p>
                    )}
                    {event.attendees?.length > 0 && (
                      <div className="flex items-center mt-2 text-white/50 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.attendees.length} attendees</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          </div>
        </div>

        {showEventForm && (
          <EventFormModal
            selectedDate={selectedDate}
            eventForm={eventForm}
            setEventForm={setEventForm}
            error={error}
            onClose={() => {
              setShowEventForm(false);
              setEventForm(initialEventForm);
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            modalRef={modalRef}
          />
        )}
      </div>
    </div>
  );
}