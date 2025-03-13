import React from 'react';
import { ArrowRight, Paperclip, Mic, MoreVertical, Home, ChevronDown, Phone, CheckCircle, Flame, Sun, Bell, Megaphone, Calendar, BarChart2, DollarSign, MessageSquare, X } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';
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
  onStatusChange
}: ChatAreaProps) {
  const statusRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, newMessageNumber]);

  React.useEffect(() => {
    // Clear error when creating message state changes
    if (!isCreatingMessage) {
      setError('');
    }
  }, [isCreatingMessage]);

  const statusOptions = [
    { value: 'new', label: 'New', icon: (selected: boolean) => <Home className={`w-4 h-4 ${selected ? 'text-emerald-400' : 'text-white/60'}`} /> },
    { value: 'hot', label: 'Hot', icon: (selected: boolean) => <Flame className={`w-4 h-4 ${selected ? 'text-red-400' : 'text-white/60'}`} /> },
    { value: 'warm', label: 'Warm', icon: (selected: boolean) => <Sun className={`w-4 h-4 ${selected ? 'text-amber-400' : 'text-white/60'}`} /> },
    { value: 'follow-up', label: 'Follow Up', icon: (selected: boolean) => <Bell className={`w-4 h-4 ${selected ? 'text-purple-400' : 'text-white/60'}`} /> },
    { value: 'prospecting', label: 'Prospecting', icon: (selected: boolean) => <Megaphone className={`w-4 h-4 ${selected ? 'text-blue-400' : 'text-white/60'}`} /> },
    { value: 'appointment-set', label: 'Appointment Set', icon: (selected: boolean) => <Calendar className={`w-4 h-4 ${selected ? 'text-indigo-400' : 'text-white/60'}`} /> },
    { value: 'needs-analysis', label: 'Needs Analysis', icon: (selected: boolean) => <BarChart2 className={`w-4 h-4 ${selected ? 'text-cyan-400' : 'text-white/60'}`} /> },
    { value: 'make-offer', label: 'Make Offer', icon: (selected: boolean) => <DollarSign className={`w-4 h-4 ${selected ? 'text-green-400' : 'text-white/60'}`} /> },
    { value: 'conversion', label: 'Conversion', icon: (selected: boolean) => <CheckCircle className={`w-4 h-4 ${selected ? 'text-emerald-400' : 'text-white/60'}`} /> }
  ];

  useClickOutside(statusRef, () => setShowStatusDropdown(false));

  const formatPhoneNumber = (value: string) => {
    // Strip all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format based on length
    if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const isValidPhoneNumber = (number: string) => {
    // Check if number matches (XXX) XXX-XXXX format
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(number);
  };

  const currentStatus = selectedChat?.id ? chatStatuses[selectedChat.id] || {
    label: 'New',
    icon: <Home className="w-4 h-4 text-emerald-400" />
  } : null;

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const previousValue = newMessageNumber;
    const isBackspace = input.value.length < previousValue.length;
    const hasComma = input.value.includes(',');
    
    setError('');
    
    // Handle group message creation
    if (hasComma) {
      // Remove formatting and split by comma
      const numbers = input.value.split(',').map(num => num.trim().replace(/\D/g, ''));
      const formattedNumbers = numbers.map(num => formatPhoneNumber(num));
      onNewMessageChange(formattedNumbers.join(', '));
      return;
    }
    
    // If backspacing with empty input or just "("
    if (isBackspace && (input.value === '' || previousValue === '(')) {
      setIsCreatingMessage(false);
      return;
    }
    
    // Handle backspacing
    if (isBackspace) {
      // Remove the last non-formatting character before the cursor
      let strippedNumber = previousValue.replace(/\D/g, '');
      strippedNumber = strippedNumber.slice(0, -1);
      const formattedNumber = strippedNumber ? formatPhoneNumber(strippedNumber) : '';
      onNewMessageChange(formattedNumber);
      
      // Calculate new cursor position after backspace
      const newPosition = Math.max(
        formattedNumber.length > 0 ? formattedNumber.length : 1,
        input.selectionStart || 0
      );
      setCursorPosition(newPosition);
      return;
    }
    
    // Handle regular input
    const formattedNumber = formatPhoneNumber(input.value);
    onNewMessageChange(formattedNumber);
    
    // Set cursor position after the last entered digit
    setCursorPosition(formattedNumber.length);
  };

  if (!selectedChat && !isCreatingMessage) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/40 text-center p-8">
        <div>
          <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-[#FFD700]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Select a Message</h3>
          <p className="text-white/60">Choose an existing message or start a draft</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3 border-b border-[#B38B3F]/20 flex items-center justify-between">
        {isCreatingMessage ? (
          <div className="flex-1 flex items-center space-x-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="tel"
                value={newMessageNumber}
                onChange={handlePhoneNumberChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMessageNumber.trim()) {
                    e.preventDefault();
                    if (newMessageNumber.includes(',')) {
                      // Validate all numbers in group
                      const numbers = newMessageNumber.split(',').map(n => n.trim());
                      const allValid = numbers.every(n => isValidPhoneNumber(n));
                      if (allValid) {
                        onStartChat();
                      } else {
                        setError('Please enter complete phone numbers for all recipients');
                      }
                    } else if (isValidPhoneNumber(newMessageNumber)) {
                      onStartChat();
                    } else {
                      setError('Please enter a complete phone number');
                    }
                  }
                }}
                placeholder="Enter phone number(s) separated by commas..."
                className={`w-full px-4 py-2 bg-zinc-800/50 border rounded-lg text-white placeholder-[#FFD700]/60 ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-[#B38B3F]/20'
                } focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/20 transition-all duration-200`}
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
                onClick={onStartChat}
                className="p-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsCreatingMessage(false)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
            >
              <X className="w-5 h-5 text-red-400/70 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                {selectedChat.avatar}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {selectedChat.name}
                </div>
                <div className="text-sm text-white/60">Online</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <div className="relative" ref={statusRef}>
                <button 
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center space-x-2 text-sm"
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
                              icon: option.icon(true)
                            });
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-white/5 transition-colors ${
                            currentStatus.label === option.label ? 'bg-[#B38B3F]/20' : ''
                          }`}
                        >
                          {option.icon(currentStatus.label === option.label)}
                          <span className="text-white">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-[#FFD700]" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChat?.messages?.map((message) => (
          <div
            key={message.id}
            id={`message-${message.id}`}
            className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} transition-all duration-300 relative`}
          >
            <div className={`absolute inset-0 ${
              message.type === 'sent'
                ? 'bg-[#FFD700]/5 blur-xl'
                : 'bg-[#B38B3F]/5 blur-xl'
            }`} />
            <div className={`max-w-[70%] rounded-xl px-4 py-2 ${
              message.type === 'sent'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#B38B3F] text-black relative z-10'
                : 'bg-zinc-800 text-white relative z-10'
            }`}>
              <p>{message.content}</p>
              <div className={`text-xs mt-1 ${
                message.type === 'sent' ? 'text-black/60' : 'text-white/40'
              }`}> 
                <div className="flex items-center space-x-1">
                  <span>{message.time}</span>
                  {message.status === 'failed' && (
                    <span className="text-red-400">• Failed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#B38B3F]/20">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-[#FFD700]" />
          </button>
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
            className="p-2 bg-[#FFD700] hover:bg-[#FFD700]/90 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </>
  );
}
