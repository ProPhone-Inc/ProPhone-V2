import React from 'react';
import { Plus, Users, Calendar, X, Filter, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { TaskView } from './TaskView';
import { EventFormModal } from '../EventFormModal';

interface CalendarModalProps {
  onClose: () => void;
}

export function CalendarModal({ onClose }: CalendarModalProps) {
  const [viewMode, setViewMode] = React.useState<'calendar' | 'tasks'>('calendar');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [showEventForm, setShowEventForm] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [taskStages, setTaskStages] = React.useState(['To Do', 'In Progress', 'Done']);
  const [displayMode, setDisplayMode] = React.useState<'month' | 'week' | 'day' | '4day' | 'schedule'>('month');
  const [taskDisplayMode, setTaskDisplayMode] = React.useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [events, setEvents] = React.useState([
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
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, date: newDate }
        : event
    ));
  };

  const [eventForm, setEventForm] = React.useState({
    title: '',
    type: 'event' as 'event' | 'out-of-office' | 'working-location' | 'task',
    startDate: selectedDate?.toISOString().split('T')[0] || '',
    endDate: selectedDate?.toISOString().split('T')[0] || '',
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: eventForm.title,
        type: eventForm.type,
        date: eventForm.startDate,
        time: eventForm.isAllDay ? 'All Day' : eventForm.time,
        endTime: eventForm.endTime,
        description: eventForm.description,
        location: eventForm.location,
        videoConference: eventForm.videoConference,
        notifications: eventForm.notifications,
        attendees: eventForm.attendees.split(',').map(email => email.trim()).filter(Boolean),
        status: eventForm.type === 'task' ? 'To Do' : undefined,
        isAllDay: eventForm.isAllDay,
        recurrence: eventForm.recurrence
      };
      
      setEvents(prev => [...prev, newEvent]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowEventForm(false);
      setSelectedDate(new Date(eventForm.startDate));
      
      setEventForm({
        title: '',
        type: 'event',
        startDate: selectedDate?.toISOString().split('T')[0] || '',
        endDate: selectedDate?.toISOString().split('T')[0] || '',
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
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update event when edited
  const handleEventEdit = (updatedEvent: any) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  // Delete event
  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div 
        className="relative w-[1200px] h-[calc(100vh-6rem)] max-h-[800px] rounded-xl bg-zinc-900/70 backdrop-blur-xl border border-[#B38B3F]/30 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Calendar className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Calendar</h2>
              <p className="text-white/60 text-sm">Manage your schedule and tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-[calc(100%-5rem)] overflow-hidden">
          <div className="p-4 overflow-y-auto relative h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-[#FFD700] transition-colors" />
                  </button>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={goToNextMonth}
                    className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-[#FFD700] transition-colors" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
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
                      <Filter className="w-4 h-4" />
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
                <button
                  onClick={() => setShowEventForm(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  <span>{viewMode === 'tasks' ? 'Add Task' : 'Add Event'}</span>
                </button>
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
                .filter(event => event.date === selectedDate?.toISOString().split('T')[0])
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
            onClose={() => setShowEventForm(false)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}