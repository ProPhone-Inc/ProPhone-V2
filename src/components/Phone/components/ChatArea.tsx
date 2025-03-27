import React from 'react';
import { ArrowRight, Paperclip, Mic, MoreVertical, Home, ChevronDown, Phone, CheckCircle, Smile, Bot, Clock, Info } from 'lucide-react';
import { QuickReplyModal } from './QuickReplyModal';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useCallState } from '../../../hooks/useCallState';
import { useSMSUsage } from '../../../hooks/useSMSUsage';
import { formatPhoneNumber, isValidPhoneNumber } from '../../../utils/phone';
import { Dialpad } from './Dialpad';
import { ScheduleMessageModal } from './ScheduleMessageModal';
import type { Chat } from '../../../modules/phone/types';

interface ChatAreaProps {
  selectedChat: Chat | null;
  messageInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isCreatingMessage: boolean;
  setIsCreatingMessage: (value: boolean) => void;
  newMessageNumber: string;
  onNewMessageChange: (value: string) => void;
  onStartChat: () => void;
  chatStatuses: Record<string, { label: string; icon: React.ReactNode }>;
  onStatusChange: (chatId: string, status: { label: string; icon: React.ReactNode }) => void;
  onMarkRead: (chatIds: string[]) => void;
  onMarkUnread: (chatIds: string[]) => void;
  onDeleteChats: (chatIds: string[]) => void;
  onMakeCall?: (number: string) => void;
  onRetry?: (messageId: string) => void;
  onRetry: (messageId: string) => void;
  onSchedule?: (date: Date) => void;
}

interface ScrollState {
  isScrolledToBottom: boolean;
  isUserScrolling: boolean;
}

export function ChatArea({
  selectedChat,
  messageInput,
  onInputChange,
  onSendMessage,
  isCreatingMessage,
  setIsCreatingMessage,
  newMessageNumber,
  onNewMessageChange,
  onStartChat,
  chatStatuses,
  onStatusChange,
  onMarkRead,
  onMarkUnread, 
  onMakeCall,
  onDeleteChats,
  onRetry,
  onSchedule
}: ChatAreaProps) {
  const statusRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showCallModal, setShowCallModal] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [showQuickReply, setShowQuickReply] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [error, setError] = React.useState('');
  const { setActiveCall } = useCallState();
  const { incrementUsage } = useSMSUsage();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = React.useState<ScrollState>({
    isScrolledToBottom: true,
    isUserScrolling: false
  });
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  useClickOutside(menuRef, () => setShowMenu(false));
  
  React.useEffect(() => {
    // Clear error when creating message state changes
    if (!isCreatingMessage) {
      setError('');
    }
  }, [isCreatingMessage]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
    const visibleMessages = Math.floor((scrollHeight - scrollTop) / 50); // Approximate message height
    const shouldShowButton = !isAtBottom && visibleMessages > 10;
    
    setScrollState(prev => ({
      isScrolledToBottom: isAtBottom,
      isUserScrolling: true
    }));
    
    setShowScrollButton(shouldShowButton);
    
    // Reset user scrolling flag after a brief delay
    if (isAtBottom) {
      setTimeout(() => {
        setScrollState(prev => ({
          ...prev,
          isUserScrolling: false
        }));
      }, 150);
    }
  }, []);

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setScrollState(prev => ({
      ...prev,
      isScrolledToBottom: true,
      isUserScrolling: false
    }));
    setShowScrollButton(false);
  };

  return (
    <>
      <div className="px-4 py-3 border-b border-[#B38B3F]/20 flex items-center justify-between">
        {isCreatingMessage ? (
          <div className="flex-1 flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessageNumber}
                onChange={(e) => onNewMessageChange(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && newMessageNumber.trim()) {
                    e.preventDefault();
                    if (isValidPhoneNumber(newMessageNumber)) {
                      e.stopPropagation();
                      onStartChat();
                      inputRef.current?.blur();
                    } else {
                      setError('Please enter a complete phone number');
                    }
                  }
                }}
                className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white placeholder-white/40 focus:outline-none ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-[#B38B3F]/20'
                } focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/20 transition-all duration-200`}
                placeholder="Enter phone number"
                autoFocus
              />
              {error && (
                <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
            {isValidPhoneNumber(newMessageNumber) && (
              <button
                onClick={() => {
                  onStartChat();
                  inputRef.current?.blur();
                }}
                className="p-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                  {selectedChat.id === 'draft' || /^\(\d{3}\) \d{3}-\d{4}$/.test(selectedChat.name) ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : (
                    selectedChat.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {selectedChat.name}
                </div>
                {selectedChat.number && !/^\(\d{3}\) \d{3}-\d{4}$/.test(selectedChat.name) && (
                  <div className="text-sm text-white/60">{selectedChat.number}</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <div className="relative" ref={statusRef}>
                <button 
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-2 text-sm ${
                    currentStatus ? statusOptions.find(opt => opt.label === currentStatus.label)?.color : 'bg-zinc-800'
                  }`}
                >
                  {currentStatus.icon}
                  <span className="text-white">{currentStatus.label}</span>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-[#B38B3F]/20 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onStatusChange(selectedChat.id, { 
                              label: option.label, 
                              icon: option.icon
                            });
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 flex items-center space-x-3 transition-colors ${
                            currentStatus.label === option.label ? option.color : 'hover:bg-white/5'
                          }`}
                        >
                          {option.icon}
                          <span className="text-white">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  if (selectedChat?.number) {
                    onMakeCall?.(selectedChat.number);
                  } else {
                    onMakeCall?.(selectedChat.name);
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Call contact"
              >
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </button>
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                <MoreVertical className="w-5 h-5 text-[#FFD700]" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900/95 backdrop-blur-md border border-[#B38B3F]/20 rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onMarkRead([selectedChat.id]);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/5 transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4 text-white/60" />
                        <span>Mark as Read</span>
                      </button>
                      <button
                        onClick={() => {
                          onMarkUnread([selectedChat.id]);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/5 transition-colors flex items-center space-x-2"
                      >
                        <EyeOff className="w-4 h-4 text-white/60" />
                        <span>Mark as Unread</span>
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement start group functionality
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/5 transition-colors flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4 text-white/60" />
                        <span>Start Group</span>
                      </button>
                      <div className="h-px bg-[#B38B3F]/20 my-1" />
                      <button
                        onClick={() => {
                          onDeleteChats([selectedChat.id]);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}>
        {selectedChat?.messages?.map((message) => (
          <div
            key={message.id}
            id={`message-${message.id}`}
            className={`flex flex-col ${message.type === 'sent' ? 'items-end' : 'items-start'} transition-all duration-300 relative mb-12`}
          >
            <div className={`relative max-w-[70%] ${
              message.type === 'sent'
                ? 'bg-[#FFD700]/5 blur-xl'
                : 'bg-[#B38B3F]/5 blur-xl'
            }`} />
            <div className={`max-w-[70%] rounded-xl px-4 py-2 ${
              message.type === 'sent'
                ? message.status === 'failed'
                  ? 'bg-red-500 text-white relative z-10'
                  : 'bg-gradient-to-r from-[#FFD700] to-[#B38B3F] text-black relative z-10'
                : 'bg-zinc-800 text-white relative z-10'
            }`}>
              <p>{message.content}</p>
              <div className="text-xs mt-1">
                <span className={
                  message.type === 'sent' 
                    ? message.status === 'failed'
                      ? 'text-white/80'
                      : 'text-black/60'
                    : 'text-white/60'
                }>
                  {message.time}
                </span>
              </div>
            </div>
            {message.type === 'sent' && (
              <div className="mt-1 flex items-center space-x-1.5 text-xs">
                {message.scheduledFor && (
                  <span className="flex items-center space-x-1 text-amber-400/90">
                    <Clock className="w-3 h-3" />
                    <span>Scheduled for {new Date(message.scheduledFor).toLocaleString()}</span>
                  </span>
                )}
                {message.status === 'queued' && (
                  <span className="flex items-center space-x-1 text-white/70">
                    <Clock className="w-3 h-3" />
                    <span className="animate-pulse">Queued...</span>
                  </span>
                )}
                {message.status === 'sending' && (
                  <span className="flex items-center space-x-1 text-amber-400/90">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span className="animate-pulse">Sending...</span>
                  </span>
                )}
                {message.status === 'scheduled' && (
                  <span className="flex items-center space-x-1 text-[#FFD700]">
                    <Clock className="w-3 h-3" />
                    <span>Scheduled</span>
                  </span>
                )}
                {message.status === 'delivered' && (
                  <span className="flex items-center space-x-1 text-emerald-400/90">
                    <CheckCircle className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                )}
                {message.status === 'failed' && (
                  <span className="flex items-center space-x-1 text-red-400/90 group">
                    <Info className="w-3 h-3" />
                    <div className="flex items-center space-x-1 relative">
                      <span className="group-hover:hidden">Failed</span>
                      <span className="hidden group-hover:inline">Invalid destination number</span>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onRetry?.(message.id);
                        }}
                        className="ml-2 p-1 hover:bg-white/10 rounded transition-colors" 
                        title="Retry"
                      >
                        <ArrowRight className="w-3 h-3 text-red-400/90 hover:text-red-400" />
                      </button>
                    </div>
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={handleScrollToBottom}
          className="absolute bottom-20 right-4 p-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black rounded-full shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 animate-fade-in flex items-center space-x-2 z-10"
        >
          <ArrowRight className="w-5 h-5 rotate-90" />
        </button>
      )}

      <div className="p-4 border-t border-[#B38B3F]/20 bg-gradient-to-b from-transparent to-black/20 relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-[#FFD700]" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
            <Smile className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setShowQuickReply(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <Zap className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
            <Bot className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => {
              if (!selectedChat) {
                setError('Please select a chat first');
                return;
              }
              if (!messageInput.trim()) {
                setError('Please type a message first');
                return;
              }
              setShowScheduleModal(true);
            }}
            className={`p-2 hover:bg-white/10 rounded-lg transition-colors group ${
              !selectedChat || !messageInput.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={!selectedChat ? 'Select a chat first' : !messageInput.trim() ? 'Type a message first' : 'Schedule message'}
          >
            <Clock className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                onInputChange(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              className="w-full pl-4 pr-10 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40 resize-none overflow-hidden min-h-[40px] max-h-[150px] leading-normal"
              style={{ height: '40px' }}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <Mic className="w-5 h-5 text-[#FFD700]" />
            </button>
          </div>
          <button 
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
            className={`p-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              !messageInput.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Reply Modal */}
      {showQuickReply && (
        <QuickReplyModal
          onClose={() => setShowQuickReply(false)}
          onSelect={(text) => {
            onInputChange(text);
            setShowQuickReply(false);
          }}
          cursorPosition={cursorPosition}
        />
      )}
      
      {/* Schedule Message Modal */}
      {showScheduleModal && (
        <ScheduleMessageModal
          onClose={() => {
            setShowScheduleModal(false);
            setError('');
          }}
          onSchedule={(date) => {
            onSchedule?.(date);
            setShowScheduleModal(false);
          }}
        />
      )}
    </>
  );
}