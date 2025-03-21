import React from 'react';
import { Plus, Users, Calendar, X, Filter, Clock, ChevronLeft, ChevronRight, AlertTriangle, Filter as FilterIcon } from 'lucide-react';
import { useGoogleCalendar } from '../../../hooks/useGoogleCalendar';
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
  const { 
    isConnected, 
    connect, 
    sync, 
    isSyncing, 
    connectedEmail,
    error: googleError,
    isConfigured,
    events: googleEvents 
  } = useGoogleCalendar();
  const [error, setError] = React.useState<string | null>(null);
  const [taskStages, setTaskStages] = React.useState(['To Do', 'In Progress', 'Done']);
  const [displayMode, setDisplayMode] = React.useState<'month' | 'week' | 'day' | '4day' | 'schedule'>('month');
  const [taskDisplayMode, setTaskDisplayMode] = React.useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
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

  // Merge Google Calendar events with local events
  const events = React.useMemo(() => {
    // If Google Calendar is not configured, only show local events
    if (!isConfigured) {
      return localEvents;
    }

    if (!googleEvents?.length) return localEvents;
    
    // Transform Google Calendar events to match local event format
    const transformedGoogleEvents = googleEvents.map(event => ({
      id: event.id,
      title: event.title,
      type: 'event',
      date: event.start.split('T')[0],
      time: event.start.split('T')[1]?.slice(0, 5) || '00:00',
      endTime: event.end.split('T')[1]?.slice(0, 5),
      description: event.description || '',
      location: event.location,
      attendees: event.attendees?.map(a => a.email) || [],
      isGoogleEvent: true
    }));
    
    return [...localEvents, ...transformedGoogleEvents];
  }, [localEvents, googleEvents, isConfigured]);

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
    setError(null);
    
    try {
      if (!eventForm.title.trim()) {
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
                {/* Only show Google Calendar integration if configured */}
                {isConfigured && (
                  <>
                    <button
                      onClick={isConnected ? sync : connect}
                      className={`px-3 py-1.5 flex items-center space-x-2 rounded-lg transition-all duration-200 text-sm ${
                        isConnected 
                          ? 'bg-[#B38B3F]/20 text-[#FFD700] hover:bg-[#B38B3F]/30'
                          : 'bg-white hover:bg-gray-50 text-gray-600 shadow-md hover:shadow-lg border border-gray-200'
                      }`}
                    >
                      {!isConnected && (
                        <div className="w-4 h-4 relative mr-2">
                          <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                      )}
                      {isConnected && <Calendar className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />}
                      <span className="font-medium">{isConnected ? (isSyncing ? 'Syncing...' : 'Sync Calendar') : 'Sign in with Google'}</span>
                    </button>
                    {isConnected && connectedEmail && (
                      <div className="text-sm text-white/60">
                        Connected as {connectedEmail}
                      </div>
                    )}
                    {googleError && (
                      <div className="text-sm text-red-400 mt-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                        {googleError}
                      </div>
                    )}
                  </>
                )}
                {!isConfigured && (
                  <div className="text-sm text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Google Calendar requires configuration</span>
                  </div>
                )}
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
                <button
                  onClick={() => setShowEventForm(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium text-xs rounded-lg hover:opacity-90 transition-opacity" 
                  title="Create new event"
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
            onClose={() => setShowEventForm(false)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}