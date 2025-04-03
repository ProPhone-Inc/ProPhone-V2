import React from 'react';
import { CheckCircle, Circle, Clock, Calendar, Video, MapPin, Tag, Link2, Bell } from 'lucide-react';
import { CalendarModal } from './Calendar/CalendarModal';
import { EventFormModal } from './Calendar/EventFormModal';
import { useDB } from '../../hooks/useDB';

export function UpcomingTasks() {
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [localEvents, setLocalEvents] = React.useState<Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    dueDate: string;
    time: string;
    location?: string;
    videoConference?: boolean;
    attendees?: any[];
  }>>([]);
  const [eventForm, setEventForm] = React.useState({
    title: '',
    type: 'task' as 'event' | 'out-of-office' | 'working-location' | 'task',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    time: new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0'),
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
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { isLoading } = useDB();
  
  // Function to convert 24-hour time to 12-hour format
  const formatTime = (time24h: string): string => {
    const [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Handle task creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!eventForm.title?.trim()) {
        throw new Error('Task title is required');
      }

      if (!eventForm.startDate) {
        throw new Error('Due date is required');
      }

      const newTask = {
        id: `task-${Date.now()}`,
        title: eventForm.title,
        type: 'task',
        status: 'pending',
        priority: 'medium',
        dueDate: eventForm.startDate,
        time: eventForm.time || '09:00',
        description: eventForm.description,
        location: eventForm.location,
        videoConference: eventForm.videoConference,
        attendees: typeof eventForm.attendees === 'string' 
          ? eventForm.attendees.split(',').map(email => email.trim()).filter(Boolean)
          : eventForm.attendees || []
      };
      
      setLocalEvents(prev => [...prev, newTask]);
      setShowEventForm(false);
      setEventForm({
        title: '',
        type: 'task',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0'),
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
      setError(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fetch tasks and events on component mount
  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, this would fetch from an API
        // For now, we'll just set an empty array
        setLocalEvents([]);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    
    fetchTasks();
  }, []);
  
  // Combine and sort events for today
  const todaysEvents = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // Get local events and tasks for today
    const localEventsToday = localEvents
      .filter(event => event.dueDate.split('T')[0] === today)
      .map(event => ({
        ...event,
        isGoogleEvent: false
      }));

    // Combine and sort by time
    return [...localEventsToday]
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [localEvents]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500';
      case 'medium':
        return 'bg-[#FFD700]';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-[#FFD700] mr-2" />
            <h2 className="text-xl font-bold text-white">
              {isLoading ? 'Loading Tasks...' : 'Upcoming Tasks'}
            </h2>
          </div>
          <button 
            onClick={() => {
              // In a real app, this would open a modal to add a new task
              setShowEventForm(true);
            }}
            className="text-[#B38B3F] hover:text-[#FFD700] text-sm font-medium transition-colors"
          >
            + Add Task
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg border border-[#B38B3F]/20 bg-[#B38B3F]/5">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-white/20"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-5 bg-white/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : todaysEvents.length === 0 ? (
            <div className="text-center py-6 text-white/40">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p>No events or tasks scheduled for today</p>
            </div>
          ) : todaysEvents.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 rounded-lg border group ${
                item.type === 'task' 
                  ? item.status === 'completed'
                    ? 'border-white/10 bg-white/5'
                    : 'border-[#B38B3F]/20 bg-[#B38B3F]/5'
                  : 'border-[#FFD700]/20 bg-[#FFD700]/5'
              } transition-all duration-200 hover:border-[#B38B3F]/30`}
            >
              <div className="flex items-start">
                {item.type === 'task' ? (
                  <button className="mt-0.5 flex-shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-[#FFD700]" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                ) : (
                  <div className="mt-0.5 flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#FFD700]" />
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      item.type === 'task' && item.status === 'completed' 
                        ? 'text-white/50 line-through' 
                        : 'text-white'
                    }`}>
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 text-white/40 mr-1" />
                    <span className="text-xs text-white/50">{formatTime(item.time)}</span>
                    {item.type === 'event' && (
                      <>
                        {item.location && (
                          <>
                            <span className="text-white/40 mx-1">•</span>
                            <MapPin className="w-3 h-3 text-white/40 mr-1" />
                            <span className="text-xs text-white/50">{item.location}</span>
                          </>
                        )}
                        {item.videoConference && (
                          <>
                            <span className="text-white/40 mx-1">•</span>
                            <Video className="w-3 h-3 text-white/40 mr-1" />
                            <span className="text-xs text-white/50">Video Call</span>
                          </>
                        )}
                        {item.attendees?.length > 0 && (
                          <>
                            <span className="text-white/40 mx-1">•</span>
                            <Users className="w-3 h-3 text-white/40 mr-1" />
                            <span className="text-xs text-white/50">{item.attendees.length} attendees</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-[#B38B3F]/20 p-4">
        <button 
          onClick={() => {
            setShowCalendar(true);
          }}
          className="w-full py-2 text-center text-[#B38B3F] hover:text-[#FFD700] font-medium transition-colors"
        >
          View All Tasks
        </button>
      </div>
      
      {/* Calendar Modal */}
      {showCalendar && (
        <CalendarModal 
          onClose={() => setShowCalendar(false)}
          initialView="tasks"
        />
      )}
      
      {/* Task Creation Modal */}
      {showEventForm && (
        <EventFormModal
          selectedDate={new Date()}
          eventForm={{...eventForm}}
          setEventForm={(form) => setEventForm(form)}
          error={error}
          onClose={() => {
            setShowEventForm(false);
            setEventForm({
              title: '',
              type: 'task',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              time: new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0'),
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
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}