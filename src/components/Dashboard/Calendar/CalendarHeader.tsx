import React from 'react';
import { Search, Filter, Calendar as CalendarIcon, Maximize2, Minimize2, RefreshCw, ChevronDown, Check } from 'lucide-react';
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
  onClose: () => void;
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
  onClose
}: CalendarHeaderProps) {
  const { 
    isConnected, 
    connect, 
    sync, 
    isSyncing, 
    connectedEmail,
    connectedCalendars,
    selectedCalendar,
    selectCalendar 
  } = useGoogleCalendar();
  const [showCalendarDropdown, setShowCalendarDropdown] = React.useState(false);

  return (
    <div className="flex items-center justify-between p-3 border-b border-[#B38B3F]/20">
      <div className="flex items-center space-x-6">
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

      <div className="flex items-center space-x-4">
        {isConnected && (
          <div className="relative">
            <button
              onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
              className="px-4 py-2 bg-[#B38B3F]/20 text-[#FFD700] rounded-lg hover:bg-[#B38B3F]/30 transition-colors flex items-center space-x-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm">
                {connectedCalendars.find(cal => cal.id === selectedCalendar)?.name || 'Select Calendar'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showCalendarDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 border border-[#B38B3F]/20 rounded-lg shadow-xl backdrop-blur-sm z-50">
                <div className="p-2 border-b border-[#B38B3F]/20">
                  <div className="text-sm text-white/60">{connectedEmail}</div>
                </div>
                <div className="py-2">
                  {connectedCalendars.map(calendar => (
                    <button
                      key={calendar.id}
                      onClick={() => {
                        selectCalendar(calendar.id);
                        setShowCalendarDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span className="text-white">{calendar.name}</span>
                      {selectedCalendar === calendar.id && (
                        <Check className="w-4 h-4 text-[#FFD700]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={isConnected ? sync : connect}
          className={`px-4 py-2 flex items-center space-x-2 rounded-lg transition-colors ${
            isConnected 
              ? 'bg-[#B38B3F]/20 text-[#FFD700] hover:bg-[#B38B3F]/30'
              : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isConnected ? (isSyncing ? 'Syncing...' : 'Sync Now') : 'Connect Google Calendar'}</span>
        </button>
        {viewMode === 'calendar' && (
          <>
            <div className="relative">
              <button
                className="px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-white/80 text-sm rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </>
        )}
        {viewMode === 'tasks' && (
          <div className="relative">
            <button
              className="px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-white/80 text-sm rounded-lg transition-colors flex items-center space-x-1.5" 
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}