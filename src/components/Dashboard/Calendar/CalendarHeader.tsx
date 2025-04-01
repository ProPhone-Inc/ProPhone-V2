import React from 'react';
import { Plus } from 'lucide-react';
import { useGoogleCalendar } from '../../../hooks/useGoogleCalendar';

interface CalendarHeaderProps {
  viewMode: 'calendar' | 'tasks';
  setViewMode: (mode: 'calendar' | 'tasks') => void;
  displayMode: string;
  setDisplayMode: (mode: string) => void;
  taskDisplayMode?: string;
  setTaskDisplayMode?: (mode: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  onClose: () => void;
  onAddEvent: () => void;
}

export function CalendarHeader({
  viewMode,
  setViewMode,
  displayMode,
  setDisplayMode,
  taskDisplayMode,
  setTaskDisplayMode,
  filters,
  setFilters,
  statusFilter,
  setStatusFilter,
  onClose,
  onAddEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-[#B38B3F]/20">
      <div className="flex bg-zinc-800/50 rounded-lg p-0.5">
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'calendar'
              ? 'bg-[#FFD700]/90 text-black font-medium text-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5 text-sm'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setViewMode('tasks')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'tasks'
              ? 'bg-[#FFD700]/90 text-black font-medium text-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5 text-sm'
          }`}
        >
          Tasks
        </button>
      </div>
    </div>
  );
}