import React from 'react';
import { PenSquare, Phone, ChevronDown, Home, Flame, Sun, Bell, Megaphone, Calendar, BarChart2, DollarSign, CheckCircle, ThumbsDown, Ban, Filter, Mail, Eye, EyeOff, MessageCircle, X, Check, Users, Trash2, CheckSquare, Square, Info, MessageSquare } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { Dialpad } from './Dialpad';
import type { Chat } from '../../../modules/phone/types';

interface ChatsListProps {
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  selectedLine: string | null;
  currentChat: string | null;
  conversations: Chat[];
  selectedChats: string[];
  setSelectedChats: React.Dispatch<React.SetStateAction<string[]>>;
  onChatSelect: (id: string) => void;
  onNewMessage: () => void;
  chatStatuses: Record<string, { label: string; icon: React.ReactNode }>;
  onMakeCall?: (number: string) => void;
  onDeleteChats: (chatIds: string[]) => void;
  onMarkRead: (chatIds: string[]) => void;
  onMarkUnread: (chatIds: string[]) => void;
}

export function ChatsList({
  width,
  isResizing,
  onResizeStart,
  selectedLine,
  currentChat,
  conversations,
  selectedChats,
  setSelectedChats,
  onChatSelect,
  onMakeCall,
  onNewMessage,
  chatStatuses,
  onDeleteChats,
  onMarkRead,
  onMarkUnread
}: ChatsListProps) {
  const [chatPreviews, setChatPreviews] = React.useState<Record<string, { message: string; time: string }>>({});
  const [showMessageFilter, setShowMessageFilter] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [hoveredAvatar, setHoveredAvatar] = React.useState<string | null>(null);
  const [messageFilter, setMessageFilter] = React.useState<string>('all');
  const [defaultStatus] = React.useState({
    label: 'New',
    icon: <Home className="w-4 h-4 text-emerald-400" />
  });
  const [activeFilters, setActiveFilters] = React.useState<{
    readStatus: { value: string; label: string } | null;
    statuses: Array<{ value: string; label: string; icon: React.ReactNode; color: string }>;
  }>({
    readStatus: null,
    statuses: []
  });
  const messageFilterRef = React.useRef<HTMLDivElement>(null);
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(messageFilterRef, () => {
    setShowMessageFilter(false);
  });

  const handleSelectChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChats(prev => 
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleSelectAll = () => {
    setSelectedChats(prev => 
      prev.length === displayedConversations.length
        ? []
        : displayedConversations.map(chat => chat.id)
    );
  };

  const handleMarkRead = () => {
    onMarkRead(selectedChats);
  };

  const handleMarkUnread = () => {
    onMarkUnread(selectedChats);
  };

  const handleDelete = () => {
    onDeleteChats(selectedChats);
  };

  const messageFilterOptions = [
    { value: 'all', label: 'All Messages', icon: <MessageCircle className="w-4 h-4 text-white/60" />, color: 'text-white/60 bg-white/10' },
    { value: 'unread', label: 'Unread', icon: <EyeOff className="w-4 h-4 text-amber-400" />, color: 'text-amber-400 bg-amber-400/20' },
    { value: 'read', label: 'Read', icon: <Eye className="w-4 h-4 text-emerald-400" />, color: 'text-emerald-400 bg-emerald-400/20' },
    { value: 'not-responded', label: 'Not Responded', icon: <Mail className="w-4 h-4 text-red-400" />, color: 'text-red-400 bg-red-400/20' }
  ];

  const statusOptions = [
    { value: 'new', label: 'New', icon: <Home className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-400/20' },
    { value: 'hot', label: 'Hot', icon: <Flame className="w-4 h-4" />, color: 'text-red-400 bg-red-400/20' },
    { value: 'warm', label: 'Warm', icon: <Sun className="w-4 h-4" />, color: 'text-amber-400 bg-amber-400/20' },
    { value: 'follow-up', label: 'Follow Up', icon: <Bell className="w-4 h-4" />, color: 'text-purple-500 bg-purple-500/20' },
    { value: 'prospecting', label: 'Prospecting', icon: <Megaphone className="w-4 h-4" />, color: 'text-blue-400 bg-blue-400/20' },
    { value: 'appointment-set', label: 'Appointment Set', icon: <Calendar className="w-4 h-4" />, color: 'text-indigo-400 bg-indigo-400/20' },
    { value: 'needs-analysis', label: 'Needs Analysis', icon: <BarChart2 className="w-4 h-4" />, color: 'text-cyan-400 bg-cyan-400/20' },
    { value: 'make-offer', label: 'Make Offer', icon: <DollarSign className="w-4 h-4" />, color: 'text-green-400 bg-green-400/20' },
    { value: 'not-interested', label: 'Not Interested', icon: <ThumbsDown className="w-4 h-4" />, color: 'text-gray-400 bg-gray-400/20' },
    { value: 'dnc', label: 'DNC', icon: <Ban className="w-4 h-4" />, color: 'text-red-700 bg-red-700/20' },
    { value: 'conversion', label: 'Conversion', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-400/20' }
  ];

  const handleMessageFilterClick = (option: { value: string; label: string; icon: React.ReactNode }) => {
    // Update message filter
    setMessageFilter(option.value);
    
    // Update active filters
    if (option.value === 'all') {
      setActiveFilters(prev => ({ ...prev, readStatus: null }));
    } else {
      setActiveFilters(prev => ({
        ...prev,
        readStatus: { value: option.value, label: option.label }
      }));
    }
    
    setShowMessageFilter(false);
  };

  const handleStatusFilterClick = (option: { value: string; label: string; icon: React.ReactNode; color?: string }) => {
    // Add new status to active filters
    const newStatus = {
      value: option.value,
      label: option.label,
      icon: option.icon,
      color: option.color || ''
    };
    
    // Only add if not already present
    setActiveFilters(prev => ({
      ...prev,
      statuses: prev.statuses.some(s => s.value === option.value) 
        ? prev.statuses 
        : [...prev.statuses, newStatus]
    }));
    
    setShowMessageFilter(false);
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

  const displayedConversations = React.useMemo(() => { 
    if (!selectedLine) return [];
    return [...conversations].sort((a, b) => {
      // Get the most recent message time for each chat
      const aTime = new Date(a.messages.length > 0 ? a.messages[a.messages.length - 1].time : a.time).getTime();
      const bTime = new Date(b.messages.length > 0 ? b.messages[b.messages.length - 1].time : b.time).getTime();
      return bTime - aTime; // Sort descending (most recent first)
    }).filter(chat => {
      if (chat.lineId !== selectedLine) return false;
      
      // Apply message filter
      if (messageFilter === 'unread' && chat.unread === 0) return false;
      if (messageFilter === 'read' && chat.unread > 0) return false;
      if (messageFilter === 'not-responded' && chat.messages.length > 0 && 
          chat.messages[chat.messages.length - 1].type === 'sent') return false;
      
      // Apply status filter
      if (activeFilters.statuses.length === 0) return true;
      
      // Check if chat matches any of the selected status filters
      const chatStatus = chatStatuses[chat.id]?.label.toLowerCase();
      return activeFilters.statuses.some(status => status.value === chatStatus);
    });
  }, [selectedLine, conversations, messageFilter, activeFilters.statuses, chatStatuses]);

  return (
    <div
      className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/60 flex flex-col relative group isolate"
      style={{ width }}
    >
      <div className="sticky top-0 p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70 z-[100]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Chats</h2>
          <div className="flex items-center space-x-3">
            <div className="relative z-[110]" ref={messageFilterRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMessageFilter(!showMessageFilter);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  messageFilter !== 'all' || selectedStatus !== 'all'
                    ? 'bg-[#FFD700]/20 text-[#FFD700]'
                    : 'hover:bg-white/10 text-[#FFD700]'
                }`}
                title="Filter Chats"
              >
                <Filter className="w-5 h-5" />
              </button>
              {showMessageFilter && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900/95 backdrop-blur-md border border-[#B38B3F]/20 rounded-lg shadow-xl">
                <div className="p-2 border-b border-[#B38B3F]/20">
                  <div className="text-xs font-medium text-white/60 mb-2">Message Status</div>
                  {messageFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleMessageFilterClick(option)}
                      className={`w-full px-4 py-2 flex items-center space-x-3 transition-colors ${
                        messageFilter === option.value ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-white hover:bg-white/5'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-2">
                  <div className="text-xs font-medium text-white/60 mb-2">Contact Status</div>
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilterClick(option)}
                      className={`w-full px-4 py-2 flex items-center space-x-3 transition-colors rounded-lg ${
                        selectedStatus === option.value ? option.color : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <span className={selectedStatus === option.value ? '' : option.color.split(' ')[0]}>
                        {option.icon}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              )}
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
              <PenSquare className="w-5 h-5" />
            </button>
            <button
              disabled={!selectedLine}
              className={`p-2 rounded-lg transition-colors cursor-default ${
                selectedLine
                  ? 'hover:bg-white/10 text-[#FFD700] cursor-pointer'
                  : 'text-white/20'
              }`}
              title={selectedLine ? 'Make Call' : 'Select a line to make calls'}
              onClick={() => {
                if (selectedLine) {
                  onMakeCall?.(selectedLine || '');
                }
              }}
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Active Filters */}
        {(activeFilters.readStatus || activeFilters.statuses.length > 0) && (
          <div className="flex items-center flex-wrap gap-2">
            {activeFilters.readStatus && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 ${
                messageFilterOptions.find(opt => opt.value === activeFilters.readStatus?.value)?.color
              }`}>
                <span className="flex items-center">
                  {messageFilterOptions.find(opt => opt.value === activeFilters.readStatus?.value)?.icon}
                </span>
                <span className="ml-1.5">{activeFilters.readStatus.label}</span>
                <button
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, readStatus: null }));
                    setMessageFilter('all');
                  }}
                  className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {activeFilters.statuses.map((status) => (
              <div 
                key={status.value}
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 ${status.color}`}
              >
                <span className="flex items-center">
                  {status.icon}
                </span>
                <span>{status.label}</span>
                <button
                  onClick={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      statuses: prev.statuses.filter(s => s.value !== status.value),
                    }));
                  }}
                  className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedChats.length > 0 && (
        <div 
          ref={toolbarRef}
          className="absolute mx-4 bottom-4 bg-gradient-to-r from-[#B38B3F]/60 to-[#FFD700]/60 backdrop-blur-sm rounded-lg h-8 shadow-lg shadow-[#B38B3F]/10 px-2 flex items-center space-x-1 z-[200] animate-fade-in border border-[#B38B3F]/20"
          style={{ 
            width: 'calc(100% - 32px)',
            left: '16px'
          }}
        >
          <button
            onClick={handleSelectAll}
            className="px-2 py-1 hover:bg-black/10 rounded-md transition-colors text-black/90 flex items-center space-x-1.5 text-xs font-medium"
            title={selectedChats.length === displayedConversations.length ? "Deselect All" : "Select All"}
          >
            {selectedChats.length === displayedConversations.length ? (
              <CheckSquare className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span className="text-sm">{selectedChats.length} selected</span>
          </button>
          <div className="w-px h-3 bg-black/5" />
          <button
            onClick={handleMarkRead}
            className="p-1 hover:bg-black/10 rounded-md transition-colors text-black/90"
            title="Mark as Read"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMarkUnread}
            className="p-1 hover:bg-black/10 rounded-md transition-colors text-black/90"
            title="Mark as Unread"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-black/10 rounded-md transition-colors text-black/90"
            title="Delete Selected"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto relative">
        {displayedConversations.map((chat) => (
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
              <div 
                className="relative flex-shrink-0 group"
                onMouseEnter={() => setHoveredAvatar(chat.id)}
                onMouseLeave={() => setHoveredAvatar(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectChat(chat.id, e);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700]">
                  {chat.id === 'draft' || /^\(\d{3}\) \d{3}-\d{4}$/.test(chat.name) ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : chat.isGroup ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    chat.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                  )}
                </div>
                {(hoveredAvatar === chat.id || selectedChats.includes(chat.id)) && (
                  <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transform transition-all duration-200 group-hover:scale-110">
                    <div className="w-4 h-4 rounded border-2 border-[#FFD700] bg-[#FFD700]/20 flex items-center justify-center">
                      {selectedChats.includes(chat.id) ? (
                        <Check className="w-3 h-3 text-[#FFD700]" />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  <div className="flex items-center space-x-1">
                    <span>{chat.id === 'draft' ? 'Draft Message' : chat.name}</span>
                    {chat.messages[chat.messages.length - 1]?.status === 'failed' && (
                      <Info className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                  chat.messages[chat.messages.length - 1]?.status === 'failed'
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
                  ) : chatStatuses[chat.id]?.icon || defaultStatus.icon}
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