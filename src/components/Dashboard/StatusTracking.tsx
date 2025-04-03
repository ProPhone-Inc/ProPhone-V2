import React from 'react';
import { Home, Flame, Sun, Bell, Megaphone, Calendar, BarChart2, DollarSign, ThumbsDown, Ban, CheckCircle } from 'lucide-react';

export function StatusTracking() {
  const [statusCounts, setStatusCounts] = React.useState<Record<string, number>>({
    'New': 1,
    'Hot': 0,
    'Warm': 0,
    'Follow Up': 0,
    'Prospecting': 0,
    'Appointment Set': 0,
    'Needs Analysis': 0,
    'Make Offer': 0,
    'Not Interested': 0,
    'DNC': 0,
    'Conversion': 0
  });

  // Set up polling interval for real-time updates
  React.useEffect(() => {
    // In a real implementation, this would connect to a WebSocket or use polling
    // to get real-time updates from the phone system
    
    // For now, we'll use the static counts defined in state
    // This ensures we show at least 1 for the "New" status to match the phone UI
  }, []);

  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Status Tracking</h2>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {[
            { status: 'New', count: statusCounts['New'], color: 'bg-emerald-500/20 text-emerald-400', icon: <Home className="w-5 h-5" /> },
            { status: 'Hot', count: statusCounts['Hot'], color: 'bg-red-500/20 text-red-400', icon: <Flame className="w-5 h-5" /> },
            { status: 'Warm', count: statusCounts['Warm'], color: 'bg-amber-500/20 text-amber-400', icon: <Sun className="w-5 h-5" /> },
            { status: 'Follow Up', count: statusCounts['Follow Up'], color: 'bg-purple-500/20 text-purple-500', icon: <Bell className="w-5 h-5" /> },
            { status: 'Prospecting', count: statusCounts['Prospecting'], color: 'bg-blue-500/20 text-blue-400', icon: <Megaphone className="w-5 h-5" /> },
          ].map((item) => (
            <div key={item.status} className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                  {React.cloneElement(item.icon, { className: `w-5 h-5 ${item.color.split(' ')[1]}` })}
                </div>
                <div className={`text-2xl font-bold ${item.color.split(' ')[1]} transition-all duration-300`}>{item.count}</div>
              </div>
              <div className="text-white/70 text-sm mt-1">{item.status}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {[
            { status: 'Appointment Set', count: statusCounts['Appointment Set'], color: 'bg-indigo-500/20 text-indigo-400', icon: <Calendar className="w-5 h-5" /> },
            { status: 'Needs Analysis', count: statusCounts['Needs Analysis'], color: 'bg-cyan-500/20 text-cyan-400', icon: <BarChart2 className="w-5 h-5" /> },
            { status: 'Make Offer', count: statusCounts['Make Offer'], color: 'bg-green-500/20 text-green-400', icon: <DollarSign className="w-5 h-5" /> },
            { status: 'Not Interested', count: statusCounts['Not Interested'], color: 'bg-gray-500/20 text-gray-400', icon: <ThumbsDown className="w-5 h-5" /> },
            { status: 'Conversion', count: statusCounts['Conversion'], color: 'bg-emerald-500/20 text-emerald-400', icon: <CheckCircle className="w-5 h-5" /> }
          ].map((item) => (
            <div key={item.status} className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                  {React.cloneElement(item.icon, { className: `w-5 h-5 ${item.color.split(' ')[1]}` })}
                </div>
                <div className={`text-2xl font-bold ${item.color.split(' ')[1]} transition-all duration-300`}>{item.count}</div>
              </div>
              <div className="text-white/70 text-sm mt-1">{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}