import React from 'react';
import { Send, X, Maximize2 } from 'lucide-react';
import { Message } from '../types';
import { useCopilotChat } from '../hooks/useCopilotChat';
import { QuickQuestions } from './QuickQuestions';
import { MessageList } from './MessageList';

interface CopilotChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isSetupMode: boolean;
  onExpand: () => void;
  onClose: () => void;
  onNewMessage: () => void;
}

export function CopilotChat({
  messages,
  setMessages,
  isSetupMode,
  onExpand,
  onClose,
  onNewMessage
}: CopilotChatProps) {
  const {
    inputValue,
    setInputValue,
    isTyping,
    handleSubmit,
    handleQuickQuestion
  } = useCopilotChat({
    messages,
    setMessages,
    isSetupMode,
    onNewMessage
  });

  return (
    <div className="absolute bottom-[calc(100%+1rem)] right-0 w-96 z-[201]">
      <div className="bg-gradient-to-br from-black to-zinc-900/95 border border-[#B38B3F]/30 rounded-2xl shadow-2xl transform-gpu animate-fade-up shadow-[#B38B3F]/20">
        <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
              ProPhone Copilot
            </h3>
            <p className="text-white/70 text-sm">Your AI assistant</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExpand}
              className="text-white/50 hover:text-[#FFD700] transition-colors p-1.5 hover:bg-white/5 rounded-lg"
              title="Expand chat"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <MessageList messages={messages} isTyping={isTyping} />

        {messages.length === 0 && (
          <QuickQuestions onQuestionSelect={handleQuickQuestion} />
        )}

        <div className="p-4 border-t border-[#B38B3F]/20">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 text-white px-3 py-2 rounded-lg border border-[#B38B3F]/20 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/40 focus:border-[#B38B3F]/40 placeholder-white/40 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[#B38B3F]/20 bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}