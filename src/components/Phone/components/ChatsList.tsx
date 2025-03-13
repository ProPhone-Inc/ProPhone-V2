import React from 'react';
import { PenSquare, Phone, CheckCircle, Home, Sun, Flame, Megaphone, Calendar, BarChart2, DollarSign, Bell, Filter } from 'lucide-react';
import type { Chat } from '../../../modules/phone/types';

interface ChatsListProps {
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  selectedLine: string | null;
  currentChat: string | null;
  conversations: Chat[];
  onChatSelect: (id: string) => void;
  onNewMessage: () => void;
  chatStatuses: Record<string, { label: string; icon: React.ReactNode }>;
}

type FilterState = {
  readStatus: 'all' | 'unread' | 'read';
  status: string;
};

export function ChatsList({
  width,
  isResizing,
  onResizeStart,
  selectedLine,
  currentChat,
  conversations,
  onChatSelect,
  onNewMessage,
  chatStatuses
}: ChatsListProps) {
  const [chatPreviews, setChatPreviews] = React.useState<Record<string, { message: string; time: string }>>({});
  const [filters, setFilters] = React.useState<FilterState>({
    readStatus: 'all',
    status: 'all'
  });
  const [selectedFilters, setSelectedFilters] = React.useState<{
    readStatus: string | null;
    statuses: string[];
  }>({
    readStatus: null,
    statuses: []
  });
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  const statusIcons = {
    new: <Home className="w-4 h-4 text-emerald-400" />,
    hot: <Flame className="w-4 h-4 text-red-400" />,
    warm: <Sun className="w-4 h-4 text-amber-400" />,
    'follow-up': <Bell className="w-4 h-4 text-purple-400" />,
    prospecting: <Megaphone className="w-4 h-4 text-blue-400" />,
    'appointment-set': <Calendar className="w-4 h-4 text-indigo-400" />,
    'needs-analysis': <BarChart2 className="w-4 h-4 text-cyan-400" />,
    'make-offer': <DollarSign className="w-4 h-4 text-green-400" />,
    conversion: <CheckCircle className="w-4 h-4 text-emerald-400" />
  };

  // Update chat previews when conversations change
  React.useEffect(() => {
    const previews: Record<string, { message: string; time: string }> = {};
    conversations.forEach(chat => {
      if (chat.messages.length > 0) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        previews[chat.id] = {
          message: lastMessage.content,
          time: lastMessage.time
        };
      }
    });
    setChatPreviews(previews);
  }, [conversations]);

  // Close filter dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: <Filter className="w-4 h-4 text-white/60" /> },
    { value: 'new', label: 'New', icon: <Home className="w-4 h-4 text-emerald-400" /> },
    { value: 'hot', label: 'Hot', icon: <Flame className="w-4 h-4 text-red-400" /> },
    { value: 'warm', label: 'Warm', icon: <Sun className="w-4 h-4 text-amber-400" /> },
    { value: 'follow-up', label: 'Follow Up', icon: <Bell className="w-4 h-4 text-purple-400" /> },
    { value: 'prospecting', label: 'Prospecting', icon: <Megaphone className="w-4 h-4 text-blue-400" /> },
    { value: 'appointment-set', label: 'Appointment Set', icon: <Calendar className="w-4 h-4 text-indigo-400" /> },
    { value: 'needs-analysis', label: 'Needs Analysis', icon: <BarChart2 className="w-4 h-4 text-cyan-400" /> },
    { value: 'make-offer', label: 'Make Offer', icon: <DollarSign className="w-4 h-4 text-green-400" /> },
    { value: 'conversion', label: 'Conversion', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> }
  ];

  const filteredConversations = React.useMemo(() => { 
    if (!selectedLine) return [];
    
    return conversations.filter(chat => {
      if (chat.lineId !== selectedLine) {
        return false;
      }
      
      // Apply read status filter
      if (filters.readStatus === 'unread' && chat.unread === 0) {
        return false;
      }
      if (filters.readStatus === 'read' && chat.unread > 0) {
        return false;
      }
      
      // Apply status filter
      if (filters.status !== 'all') {
        const chatStatus = chatStatuses[chat.id]?.label.toLowerCase();
        if (chatStatus !== filters.status.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    });
  }, [selectedLine, conversations, filters, chatStatuses]);

  return (
    <div 
      className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/60 flex flex-col relative group"
      style={{ width }}
    >
      <div className="sticky top-0 p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Chats</h2>
          <div className="flex items-center space-x-2">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedFilters.readStatus || selectedFilters.statuses.length > 0
                    ? 'bg-[#FFD700]/20 text-[#FFD700]'
                    : 'hover:bg-white/10 text-[#FFD700]'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-[#B38B3F]/20 rounded-lg shadow-xl z-[100]">
                  <div className="p-2 border-b border-[#B38B3F]/20">
                    <div className="text-xs font-medium text-white/60 mb-2">Message Status</div>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, readStatus: 'all' }));
                        setSelectedFilters(prev => ({ ...prev, readStatus: null }));
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors ${
                        filters.readStatus === 'all' ? 'text-[#FFD700]' : 'text-white'
                      }`}
                    >
                      All Messages
                    </button>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, readStatus: 'unread' }));
                        setSelectedFilters(prev => ({ ...prev, readStatus: 'unread' }));
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors ${
                        filters.readStatus === 'unread' ? 'text-[#FFD700]' : 'text-white'
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, readStatus: 'read' }));
                        setSelectedFilters(prev => ({ ...prev, readStatus: 'read' }));
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors ${
                        filters.readStatus === 'read' ? 'text-[#FFD700]' : 'text-white'
                      }`}
                    >
                      Read
                    </button>
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-medium text-white/60 mb-2">Contact Status</div>
                    {statusOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, status: option.value }));
                          if (option.value === 'all') {
                            setSelectedFilters(prev => ({ ...prev, statuses: [] }));
                          } else {
                            setSelectedFilters(prev => ({
                              ...prev,
                              statuses: [...prev.statuses, option.value]
                            }));
                          }
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-3 ${
                          selectedFilters.statuses.includes(option.value) || 
                          (option.value === 'all' && selectedFilters.statuses.length === 0)
                            ? 'text-[#FFD700]'
                            : 'text-white'
                        }`}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Selected Filters Display */}
            {(selectedFilters.readStatus || selectedFilters.statuses.length > 0) && (
              <div className="absolute left-0 right-0 -bottom-12 flex flex-wrap gap-2 px-4 py-2 bg-zinc-900/95 border-b border-[#B38B3F]/20">
                {selectedFilters.readStatus && (
                  <div className="px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-medium flex items-center">
                    <span>{selectedFilters.readStatus.charAt(0).toUpperCase() + selectedFilters.readStatus.slice(1)}</span>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, readStatus: 'all' }));
                        setSelectedFilters(prev => ({ ...prev, readStatus: null }));
                      }}
                      className="ml-1 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedFilters.statuses.map(status => {
                  const option = statusOptions.find(opt => opt.value === status);
                  if (!option) return null;
                  return (
                    <div key={status} className="px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-medium flex items-center">
                      {option.icon}
                      <span className="ml-1">{option.label}</span>
                      <button
                        onClick={() => {
                          setSelectedFilters(prev => ({
                            ...prev,
                            statuses: prev.statuses.filter(s => s !== status)
                          }));
                          if (selectedFilters.statuses.length === 1) {
                            setFilters(prev => ({ ...prev, status: 'all' }));
                          }
                        }}
                        className="ml-1 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <button 
              onClick={() => {
                if (selectedLine) {
                  onNewMessage();
                  onChatSelect(null);
                }
              }}
              disabled={!selectedLine}
              className={`p-2 rounded-lg transition-colors ${
                selectedLine 
                  ? 'hover:bg-white/10 text-[#FFD700]' 
                  : 'opacity-50 cursor-not-allowed text-white/40'
              }`}
              title={selectedLine ? 'Draft Message' : 'Select a line to create draft'}
            >
              <PenSquare className="w-5 h-5" />
            </button>
            <button
              disabled={!selectedLine}
              className={`p-2 rounded-lg transition-colors cursor-default ${
                selectedLine
                  ? 'hover:bg-white/10 text-[#FFD700]'
                  : 'text-white/20'
              }`}
              title={selectedLine ? 'Make Call' : 'Select a line to make calls'}
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto relative">
        {filteredConversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full px-4 py-3 text-left transition-colors relative ${
              chat.id === 'draft' ? 'bg-[#FFD700]/10 border-l-2 border-[#FFD700] opacity-75' : ''
            } ${
              currentChat === chat.id
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border-l-2 border-[#FFD700] shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700]">
                  {chat.id === 'draft' ? (
                    <PenSquare className="w-5 h-5" />
                  ) : chat.isGroup ? (
                    <Users className="w-5 h-5" />
                  ) : /^\(\d{3}\) \d{3}-\d{4}$/.test(chat.name) ? (
                    <PenSquare className="w-5 h-5" />
                  ) : (
                    chat.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {chat.id === 'draft' ? 'Draft Message' : chat.name}
                </div>
                <div className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                  chat.messageStatus?.label === 'Failed' 
                    ? 'text-red-400 font-medium' 
                    : chat.unread > 0 
                      ? 'text-white font-medium' 
                      : 'text-white/60'
                }`}>
                  {chat.id === 'draft' ? 'Enter phone number to create message' : (chatPreviews[chat.id]?.message || chat.lastMessage)}
                </div>
              </div>
              <div className="w-[72px] flex-shrink-0 flex flex-col items-end justify-start">
                <div className="flex items-center justify-end space-x-1 h-5 w-full">
                  {chat.messageStatus?.label === 'Failed' ? (
                    <span className="text-xs text-red-400">Failed</span>
                  ) : chatStatuses[chat.id]?.icon}
                  <span className="text-xs text-white/40 whitespace-nowrap">
                    {chatPreviews[chat.id]?.time || chat.time}
                  </span>
                </div>
                <div className="h-[18px] mt-1 flex items-center justify-end">
                  {chat.unread > 0 && (
                    <div className="min-w-[18px] h-[18px] rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onResizeStart}
      />
    </div>
  );
}
