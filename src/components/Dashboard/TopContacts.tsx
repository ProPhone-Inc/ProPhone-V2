import React from 'react';
import { CheckCircle, Circle, Clock, Calendar, PenSquare, ArrowRight } from 'lucide-react';
import { CalendarModal } from './Calendar/CalendarModal';

export function TopContacts() {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const hoverTimer = React.useRef<number | null>(null);
  const [localEvents, setLocalEvents] = React.useState([
    {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Review Project Proposal',
      type: 'task',
      status: 'pending',
      priority: 'high',
      dueDate: new Date().toISOString(),
      time: '14:00'
    }
  ]);

  const handleMouseEnter = () => {
    hoverTimer.current = window.setTimeout(() => {
      setShowEdit(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setShowEdit(false);
  };
  
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

  const tasks = [
    {
      id: 1,
      title: 'Finalize Fall Campaign',
      date: 'Today, 2:00 PM',
      priority: 'high',
      completed: false,
    },
    {
      id: 2,
      title: 'Review Contact List',
      date: 'Today, 4:30 PM',
      priority: 'medium',
      completed: false,
    },
    {
      id: 3,
      title: 'Social Media Post',
      date: 'Tomorrow, 10:00 AM',
      priority: 'medium',
      completed: false,
    },
    {
      id: 4,
      title: 'Update Email Templates',
      date: 'Sep 18, 2025',
      priority: 'low',
      completed: true,
    },
    {
      id: 5,
      title: 'Customer Feedback Review',
      date: 'Sep 20, 2025',
      priority: 'high',
      completed: false,
    },
  ];

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
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-[#FFD700]" />
            <h2 className="text-xl font-bold text-white ml-2">Upcoming Tasks</h2>
            {showEdit && (
              <button 
                className="p-1 hover:bg-white/10 rounded-lg transition-colors group ml-2 opacity-0 animate-fade-in"
                onClick={() => {/* Open calendar modal */}}
              >
                <PenSquare className="w-4 h-4 text-white/40 group-hover:text-[#FFD700] transition-colors" />
              </button>
            )}
          </div>
          <button className="text-[#B38B3F] hover:text-[#FFD700] text-sm font-medium transition-colors">
            + Add Task
          </button>
        </div>

        <div className="space-y-3">
          {todaysEvents.length === 0 ? (
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
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <PenSquare className="w-3 h-3 text-white/40 hover:text-[#FFD700] transition-colors" />
                    </button>
                  </div>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 text-white/40 mr-1" />
                    <span className="text-xs text-white/50">{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-[#B38B3F]/20 p-4">
        <button 
          onClick={() => setShowCalendar(true)}
          className="w-full py-2 text-center text-[#B38B3F] hover:text-[#FFD700] font-medium transition-colors"
        >
          View All Tasks
        </button>
      </div>
      
      {/* Calendar Modal */}
      {showCalendar && (
        <CalendarModal onClose={() => setShowCalendar(false)} />
      )}
    </div>
  );
}