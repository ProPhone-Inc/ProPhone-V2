import React from 'react';
import { Message } from '../types';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.type === 'user'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#B38B3F] text-black font-medium shadow-lg shadow-[#FFD700]/10'
                : 'bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 border border-[#B38B3F]/10 text-white shadow-lg shadow-[#B38B3F]/5'
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {message.content}
            </pre>
            <div className={`text-xs mt-1 ${
              message.type === 'user' 
                ? 'text-black/60' 
                : 'text-white/50'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}