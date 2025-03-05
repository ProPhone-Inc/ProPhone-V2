import React from 'react';
import { Star, CheckCircle, Flame, Sun, Bell, BarChart2, Megaphone, DollarSign, ThumbsDown, Ban } from 'lucide-react';

export function StatusTracking() {
  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold text-white">Status Tracking</h2>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {[
            { status: 'New', count: 12, color: 'bg-blue-500/20 text-blue-400', icon: <Star className="w-5 h-5" /> },
            { status: 'Conversion', count: 8, color: 'bg-emerald-500/20 text-emerald-400', icon: <CheckCircle className="w-5 h-5" /> },
            { status: 'Hot', count: 15, color: 'bg-red-500/20 text-red-400', icon: <Flame className="w-5 h-5" /> },
            { status: 'Warm', count: 24, color: 'bg-amber-500/20 text-amber-400', icon: <Sun className="w-5 h-5" /> },
            { status: 'Follow Up', count: 18, color: 'bg-purple-500/20 text-purple-400', icon: <Bell className="w-5 h-5" /> },
          ].map((item) => (
            <div key={item.status} className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                  {React.cloneElement(item.icon, { className: `w-5 h-5 ${item.color.split(' ')[1]}` })}
                </div>
                <div className={`text-2xl font-bold ${item.color.split(' ')[1]}`}>{item.count}</div>
              </div>
              <div className="text-white/70 text-sm mt-1">{item.status}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {[
            { status: 'Needs Analysis', count: 9, color: 'bg-blue-500/20 text-blue-400', icon: <BarChart2 className="w-5 h-5" /> },
            { status: 'Prospecting', count: 31, color: 'bg-green-500/20 text-green-400', icon: <Megaphone className="w-5 h-5" /> },
            { status: 'Cash Offer', count: 5, color: 'bg-[#FFD700]/20 text-[#FFD700]', icon: <DollarSign className="w-5 h-5" /> },
            { status: 'Not Interested', count: 7, color: 'bg-gray-500/20 text-gray-400', icon: <ThumbsDown className="w-5 h-5" /> },
            { status: 'DNC', count: 3, color: 'bg-red-700/20 text-red-700', icon: <Ban className="w-5 h-5" /> },
          ].map((item) => (
            <div key={item.status} className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                  {React.cloneElement(item.icon, { className: `w-5 h-5 ${item.color.split(' ')[1]}` })}
                </div>
                <div className={`text-2xl font-bold ${item.color.split(' ')[1]}`}>{item.count}</div>
              </div>
              <div className="text-white/70 text-sm mt-1">{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}