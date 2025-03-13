import React from 'react';
import { Filter, MessageSquare, Phone, CheckCircle, Search, Home, Sun, Flame, ThumbsDown, Ban, Megaphone, Repeat, Calendar, BarChart2, DollarSign, X, Bell } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';
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
  readStatus: 'all' | 'unread' | 'read' | 'not-responded';
  status: 'all' | 'new' | 'hot' | 'warm' | 'follow-up' | 'prospecting' | 'appointment-set' | 'needs-analysis' | 'make-offer' | 'conversion';
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
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
    readStatus: 'all',
    status: 'all'
  });
  const filterRef = React.useRef<HTMLDivElement>(null);
  const [chatPreviews, setChatPreviews] = React.useState<Record<string, { message: string; time: string }>>({});

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

  // Filter conversations based on current filters
  const filteredConversations = React.useMemo(() => {
    if (!selectedLine) return [];
    
    return conversations.filter(chat => {
      // Filter by line ID
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
      if (filters.readStatus === 'not-responded' && chat.messages[chat.messages.length - 1]?.type !== 'received') {
        return false;
      }
      
      // Apply status filter
      if (filters.status !== 'all') {
        const chatStatus = chatStatuses[chat.id]?.label.toLowerCase().replace(/\s+/g, '-');
        if (chatStatus !== filters.status) {
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
                disabled={!selectedLine}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2 rounded-lg transition-colors ${
                  !selectedLine
                    ? 'opacity-50 cursor-not-allowed text-white/40'
                    : showFilterDropdown || filters.readStatus !== 'all' || filters.status !== 'all'
                      ? 'bg-[#FFD700]/20 text-[#FFD700]'
                      : 'hover:bg-white/10 text-[#FFD700]'
                }`}
                title={selectedLine ? 'Filter Messages' : 'Select a line to filter messages'}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
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
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              disabled={!selectedLine}
              className={`p-2 rounded-lg transition-colors ${
                selectedLine
                  ? 'hover:bg-white/10 text-[#FFD700]'
                  : 'opacity-50 cursor-not-allowed text-white/40'
              }`}
              title={selectedLine ? 'Make Call' : 'Select a line to make calls'}
            >
              <Phone className="w-5 h-5 text-[#FFD700]" />
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
                    <MessageSquare className="w-5 h-5" />
                  ) : chat.isGroup ? (
                    <Users className="w-5 h-5" />
                  ) : /^\(\d{3}\) \d{3}-\d{4}$/.test(chat.name) ? (
                    <MessageSquare className="w-5 h-5" />
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