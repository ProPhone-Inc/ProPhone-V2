import React from 'react';
import { Sparkles, Send, X, Maximize2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useCopilot } from '../hooks/useCopilot';
import { CopilotChat } from './CopilotChat';
import { CopilotPage } from './CopilotPage';
import { useAudio } from '../hooks/useAudio';
import { useUnreadMessages } from '../hooks/useUnreadMessages';
import { Message } from '../types';

export function CopilotBubble() {
  const { apiKey, provider } = useCopilot();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { playNotification } = useAudio();
  const { unreadCount, hasUnreadMessage, markAsRead } = useUnreadMessages(messages);

  // Show welcome message when component mounts
  React.useEffect(() => {
    const needsSetup = !provider || !apiKey;
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [provider, apiKey]);

  const getWelcomeMessage = () => {
    if (!provider || !apiKey) {
      return `Hi there! 👋 I'm Dawson, your ProPhone CoPilot, ready to supercharge your productivity!

I noticed I'm not set up yet. Let me help you get started in just 2 minutes:

1️⃣ Choose your preferred AI provider:
   • OpenAI (GPT-4)
   • Anthropic (Claude)
   • Google (Gemini)

2️⃣ Add your API key

Once configured, I'll help you:
✨ Automate your workflows
🎯 Generate targeted campaigns
📞 Handle calls intelligently
📊 Analyze your metrics

Ready to begin? Just tell me which provider you'd like to use (OpenAI, Anthropic, or Google) and I'll guide you through the setup!`;
    }

    return "Hi there! 👋 I'm Dawson, your ProPhone CoPilot. I'm ready to help with calls, automation workflows, templates, designs, and more. How can I assist you today?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen && (
        <>
          {isExpanded ? (
            <div className="fixed inset-0 z-[300]">
              <CopilotPage
                isOpen={isExpanded}
                onClose={() => {
                  setIsExpanded(false);
                  setIsOpen(true);
                }}
                initialMessages={messages}
                isSetupMode={!provider || !apiKey}
                onNewMessage={(message) => {
                  setMessages(prev => [...prev, message]);
                  playNotification();
                }}
              />
            </div>
          ) : (
            <CopilotChat
              messages={messages}
              setMessages={setMessages}
              isSetupMode={!provider || !apiKey}
              onExpand={() => {
                setIsExpanded(true);
                setIsOpen(true);
              }}
              onClose={() => setIsOpen(false)}
              onNewMessage={() => playNotification()}
            />
          )}
        </>
      )}

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            markAsRead();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] ${
          hasUnreadMessage ? 'animate-pulse' : ''
        }`}
      >
        <Sparkles className={`w-6 h-6 z-10 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
        
        {/* Soundwave rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/20 animate-[soundwave_2s_ease-out_infinite]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/20 animate-[soundwave_2s_ease-out_infinite_0.75s]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/20 animate-[soundwave_2s_ease-out_infinite_1.5s]" />
        
        {hasUnreadMessage && (
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] border-2 border-black text-xs font-bold flex items-center justify-center animate-bounce shadow-lg shadow-[#FFD700]/20">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}