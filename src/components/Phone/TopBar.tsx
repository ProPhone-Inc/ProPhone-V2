import React from 'react';
import { Search, Bell } from 'lucide-react';

interface TopBarProps {
  onOpenSearch: () => void;
  unreadCount: number;
}

export function TopBar({ onOpenSearch, unreadCount }: TopBarProps) {
  return (
    <div className="fixed top-0 left-16 right-0 h-16 bg-zinc-900 border-b border-[#B38B3F]/20 flex items-center px-4">
      <div className="flex-1 relative">
        <button 
          onClick={onOpenSearch}
          className="w-full px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white/60 hover:text-white text-left flex items-center transition-colors"
        >
          <Search className="w-5 h-5 mr-2" />
          <span>Search conversations...</span>
        </button>
      </div>
      <div className="ml-4 flex items-center space-x-4">
        <button className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}