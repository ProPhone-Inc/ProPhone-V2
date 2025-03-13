import React from 'react';
import { Sparkles, Send, Bot, Settings, X } from 'lucide-react';
import { useCopilot } from '../hooks/useCopilot';
import { Message } from '../types';

interface CopilotPageProps {
  isOpen: boolean;
  onClose: () => void;
  isSetupMode?: boolean;
  initialMessages?: Message[];
  onNewMessage?: (message: Message) => void;
}

export function CopilotPage({ 
  isOpen, 
  onClose, 
  isSetupMode = false,
  initialMessages = [],
  onNewMessage
}: CopilotPageProps) {
  const { apiKey, provider } = useCopilot();
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // API call and response handling
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are ProPhone Copilot, an AI assistant for a marketing and phone system platform. You help users with campaign creation, workflow automation, analytics, and customer management.' },
            { role: 'user', content: userMessage.content }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (onNewMessage) {
        onNewMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const fallbackMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: "I'm here to help! You can ask me about:\n- Creating campaigns\n- Analyzing metrics\n- Optimizing workflows\n- Managing contacts\n- And more!",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      if (onNewMessage) {
        onNewMessage(fallbackMessage);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-zinc-900/95 to-black/95 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-6xl h-[800px] transform animate-fade-in flex flex-col overflow-hidden backdrop-blur-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Bot className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">ProPhone Copilot</h2>
              <p className="text-white/60">Your AI-powered assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-[#FFD700]" />
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 pointer-events-none" />
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#B38B3F] text-black shadow-lg shadow-[#FFD700]/20 relative overflow-hidden'
                    : 'bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 border border-[#B38B3F]/20 text-white shadow-lg shadow-[#B38B3F]/10 relative overflow-hidden'
                }`}
              >
                {message.type === 'user' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 animate-pulse" />
                )}
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
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 border border-[#B38B3F]/10 rounded-xl px-4 py-2 shadow-lg shadow-[#B38B3F]/5">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-[#B38B3F]/20 bg-gradient-to-b from-transparent to-black/20">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 text-white px-4 py-3 rounded-xl border border-[#B38B3F]/20 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/40 focus:border-[#B38B3F]/40 placeholder-white/40 transition-all shadow-inner shadow-black/20"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[#B38B3F]/20 bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] transform hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}