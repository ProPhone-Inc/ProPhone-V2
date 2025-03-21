import React from 'react';
import { Phone, ArrowUpRight, ArrowDownLeft, X, Clock, Search, ChevronDown, User, PhoneOff, Trash2 } from 'lucide-react';
import { useCallLogs } from '../../../hooks/useCallLogs';

interface CallLogsProps {
  onClose: () => void;
  onMakeCall?: (number: string) => void;
  width?: number;
  isResizing?: boolean;
  onResizeStart?: (e: React.MouseEvent) => void;
}

export function CallLogs({ onClose, onMakeCall }: CallLogsProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [selectedLine, setSelectedLine] = React.useState('all');
  const [groupedLogs, setGroupedLogs] = React.useState<Record<string, any[]>>({});
  const [selectedContact, setSelectedContact] = React.useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = React.useState<string[]>([]);
  const { logs, deleteLogs } = useCallLogs();
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Phone lines data
  const phoneLines = [
    { id: 'all', name: 'All Lines' },
    { id: '1', name: 'Sales Team', number: '(555) 123-4567' },
    { id: '2', name: 'Property Management', number: '(555) 987-6543' },
    { id: '3', name: 'Rentals', number: '(555) 456-7890' },
    { id: '4', name: 'Marketing', number: '(555) 234-5678' },
    { id: '5', name: 'Investments', number: '(555) 789-0123' }
  ];

  // Filter logs based on search and filters
  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchQuery.toLowerCase().split(' ').every(term =>
        (log.name || '').toLowerCase().includes(term) ||
        log.number.toLowerCase().includes(term)
      );
      
      const matchesType = typeFilter === 'all' || log.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      const matchesLine = selectedLine === 'all' || log.lineId === selectedLine;
      
      return matchesSearch && matchesType && matchesStatus && matchesLine;
    });
  }, [logs, searchQuery, typeFilter, statusFilter, selectedLine]);

  // Group logs by contact
  React.useEffect(() => {
    const grouped = filteredLogs.reduce((acc, log) => {
      const key = log.number;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(log);
      return acc;
    }, {} as Record<string, any[]>);

    // Sort each group's logs by timestamp
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

    setGroupedLogs(grouped);
  }, [filteredLogs]);

  const getCallIcon = (type: string, status: string) => {
    switch (type) {
      case 'incoming':
        return status === 'completed' ? (
          <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
        ) : status === 'missed' ? (
          <ArrowDownLeft className="w-4 h-4 text-red-400" />
        ) : (
          <X className="w-4 h-4 text-red-400" />
        );
      case 'outgoing':
        return <ArrowUpRight className="w-4 h-4 text-[#FFD700]" />;
      case 'missed':
        return <ArrowDownLeft className="w-4 h-4 text-red-400" />;
      case 'denied':
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'missed':
      case 'denied':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div 
        ref={modalRef}
        className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-4rem)] max-w-3xl max-h-[calc(100vh-4rem)] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">Call History</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#B38B3F]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {selectedLogs.length > 0 && (
                <button
                  onClick={() => {
                    deleteLogs(selectedLogs);
                    setSelectedLogs([]);
                  }}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              {phoneLines.map(line => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
              <option value="missed">Missed</option>
              <option value="denied">Denied</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
          {Object.keys(groupedLogs).length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-white/40 p-8">
              <PhoneOff className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No call logs available</p>
              <p className="text-sm">Your call history will appear here</p>
            </div>
          )}

          {Object.entries(groupedLogs).map(([number, logs]) => (
            <div key={number} className="border-b border-[#B38B3F]/10">
              <button
                onClick={() => setSelectedContact(selectedContact === number ? null : number)}
                className="w-full p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700]">
                      {logs[0].name ? (
                        logs[0].name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {logs[0].name || number}
                      </div>
                      <div className="text-sm text-white/60">
                        {logs[0].name && number}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-white/40">
                      {logs.length} {logs.length === 1 ? 'call' : 'calls'}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${
                      selectedContact === number ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </button>

              {selectedContact === number && (
                <div className="bg-zinc-800/30 border-t border-[#B38B3F]/10">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                      onClick={() => {
                        setSelectedLogs(prev => 
                          prev.includes(log.id)
                            ? prev.filter(id => id !== log.id)
                            : [...prev, log.id]
                        );
                      }}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <div className={`w-4 h-4 rounded border-2 ${
                          selectedLogs.includes(log.id)
                            ? 'border-[#FFD700] bg-[#FFD700]/20'
                            : 'border-white/20 bg-transparent'
                        } transition-colors`} />
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center">
                          {getCallIcon(log.type, log.status)}
                        </div>
                        <div>
                          <div className={`text-sm ${getStatusColor(log.status)}`}>
                            {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-white/40">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                            {log.duration && (
                              <>
                                <span>•</span>
                                <span>{log.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMakeCall?.(log.number);
                        }}
                        className="p-2 hover:bg-[#FFD700]/10 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5 text-[#FFD700]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}