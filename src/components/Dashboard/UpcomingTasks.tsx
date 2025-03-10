import React from 'react';
import { CheckCircle, Circle, Clock, Calendar, PenSquare } from 'lucide-react';

export function UpcomingTasks() {
  const [showEdit, setShowEdit] = React.useState(false);
  const hoverTimer = React.useRef<number | null>(null);

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
              <button className="p-1 hover:bg-white/10 rounded-lg transition-colors group ml-2 opacity-0 animate-fade-in">
                <PenSquare className="w-4 h-4 text-white/40 group-hover:text-[#FFD700] transition-colors" />
              </button>
            )}
          </div>
          <button className="text-[#B38B3F] hover:text-[#FFD700] text-sm font-medium transition-colors">
            + Add Task
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-3 rounded-lg border group ${task.completed ? 'border-white/10 bg-white/5' : 'border-[#B38B3F]/20 bg-[#B38B3F]/5'} transition-all duration-200 hover:border-[#B38B3F]/30`}
            >
              <div className="flex items-start">
                <button className="mt-0.5 flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-[#FFD700]" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/50" />
                  )}
                </button>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <PenSquare className="w-3 h-3 text-white/40 hover:text-[#FFD700] transition-colors" />
                    </button>
                  </div>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 text-white/40 mr-1" />
                    <span className="text-xs text-white/50">{task.date}</span>
                    <div className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-[#B38B3F]/20 p-4">
        <button className="w-full py-2 text-center text-[#B38B3F] hover:text-[#FFD700] font-medium transition-colors">
          View All Tasks
        </button>
      </div>
    </div>
  );
}