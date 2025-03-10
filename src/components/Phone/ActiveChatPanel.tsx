import React from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import type { Chat, Message } from '../../modules/phone/types';

interface ActiveChatPanelProps {
  chat: Chat | null;
  messageInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export function ActiveChatPanel({
  chat,
  messageInput,
  onInputChange,
  onSendMessage
}: ActiveChatPanelProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#B38B3F]/20">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700]">
            {chat.avatar}
          </div>
          <div>
            <div className="font-medium text-white">{chat.name}</div>
            <div className="text-sm text-white/60">{chat.status === 'online' ? 'Online' : 'Offline'}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message: Message) => (
          <div
            key={message.id}
            id={`message-${message.id}`}
            className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} transition-colors duration-300`}
          >
            <div className={`max-w-[70%] rounded-xl px-4 py-2 ${
              message.type === 'sent'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#B38B3F] text-black shadow-lg shadow-[#FFD700]/20'
                : 'bg-zinc-800 text-white'
            }`}>
              <p>{message.content}</p>
              <div className={`text-xs mt-1 ${
                message.type === 'sent' ? 'text-black/60' : 'text-white/40'
              }`}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[#B38B3F]/20">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-[#FFD700]" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              className="w-full pl-4 pr-10 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
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
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}