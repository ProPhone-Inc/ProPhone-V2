import React from 'react';
import { Sparkles, Send, Bot, Settings, X } from 'lucide-react';
import { useCopilot } from '../../hooks/useCopilot';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSetupMode?: boolean;
  initialMessages?: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  onNewMessage?: (message: {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }) => void;
}

export function CopilotPage({ isOpen, onClose, isSetupMode: propIsSetupMode, initialMessages = [], onNewMessage }: CopilotModalProps) {
  const { apiKey, provider } = useCopilot();
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const [isSetupMode, setIsSetupMode] = React.useState(false);
  const [needsSetup, setNeedsSetup] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>(initialMessages);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on mount
  React.useEffect(() => {
    if (messages.length === 0 && initialMessages.length === 0) {
      // Check if setup is needed
      const needsSetup = !provider && !apiKey && !openaiKey;
      setIsSetupMode(needsSetup);
      setNeedsSetup(needsSetup);

      setMessages([{
        id: '1',
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      }]);
    }
  }, []);

  const getWelcomeMessage = () => {
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
  };

  const getProviderSetupInstructions = (provider: string) => {
    const instructions = {
      openai: {
        title: "OpenAI (GPT-4) Setup Instructions",
        steps: [
          "1. Visit OpenAI's platform at https://platform.openai.com",
          "2. Sign in or create an account",
          "3. Go to API Keys section",
          "4. Click 'Create new secret key'",
          "5. Copy your API key"
        ],
        video: "https://www.youtube.com/embed/SzPE_AE0eEo",
        docs: "https://platform.openai.com/docs/api-reference"
      },
      anthropic: {
        title: "Anthropic (Claude) Setup Instructions",
        steps: [
          "1. Go to Anthropic's console at https://console.anthropic.com",
          "2. Sign in to your account",
          "3. Navigate to API Keys",
          "4. Generate a new API key",
          "5. Save your key securely"
        ],
        video: "https://www.youtube.com/embed/DEF456",
        docs: "https://docs.anthropic.com/claude/reference"
      },
      google: {
        title: "Google (Gemini) Setup Instructions",
        steps: [
          "1. Visit Google AI Studio at https://makersuite.google.com/app/apikey",
          "2. Sign in with your Google account",
          "3. Click 'Get API key'",
          "4. Create a new key or select existing",
          "5. Copy your API key"
        ],
        video: "https://www.youtube.com/embed/GHI789",
        docs: "https://ai.google.dev/docs"
      }
    };
    return instructions[provider as keyof typeof instructions];
  };

  const handleProviderSetup = (selectedProvider: string) => {
    const instructions = getProviderSetupInstructions(selectedProvider);
    setSelectedProvider(selectedProvider);
    
    const response = `Great choice! Let me help you set up ${instructions.title}:

${instructions.steps.join('\n')}

Here's a helpful video tutorial:
<iframe width="100%" height="200" src="${instructions.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

📚 Official Documentation: ${instructions.docs}

Once you have your API key:
1. Click the Settings icon in the top right corner
2. Go to "CoPilot Settings"
3. Click "Add New Configuration"
4. Enter your API key

Need help with anything else?`;

    const assistantMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assistant' as const,
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Extract any action commands from previous assistant message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'assistant') {
      const actionMatches = lastMessage.content.match(/\[ACTION:([^\]]+)\]/g);
      if (actionMatches) {
        for (const match of actionMatches) {
          const [_, actionStr] = match.match(/\[ACTION:([^\]]+)\]/) || [];
          if (actionStr) {
            const [action, ...params] = actionStr.split('|');
            const parameters = Object.fromEntries(
              params.map(p => {
                const [key, value] = p.split('=');
                return [key, value];
              })
            );
            
            // Handle different action types
            switch (action) {
              case 'CREATE_MESSAGE':
                if (parameters.number && parameters.content) {
                  // Create new message
                  const newMessage = {
                    id: Math.random().toString(36).substr(2, 9),
                    lineId: selectedLine,
                    name: parameters.number,
                    avatar: 'NM',
                    messages: [],
                    lastMessage: parameters.content,
                    time: new Date().toLocaleTimeString(),
                    unread: 0
                  };
                  // Add message to conversations
                  setConversations(prev => [...prev, newMessage]);
                }
                break;
                
              case 'UPDATE_STATUS':
                if (parameters.chatId && parameters.status) {
                  // Update chat status
                  setChatStatuses(prev => ({
                    ...prev,
                    [parameters.chatId]: {
                      label: parameters.status,
                      icon: getStatusIcon(parameters.status)
                    }
                  }));
                }
                break;
                
              case 'ANALYZE_CHAT':
                if (parameters.chatId) {
                  const chat = conversations.find(c => c.id === parameters.chatId);
                  if (chat) {
                    // Analyze chat messages and generate insights
                    const analysis = analyzeChat(chat);
                    const analysisMessage = {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'assistant' as const,
                      content: analysis,
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, analysisMessage]);
                  }
                }
                break;
            }
          }
        }
      }
    }
    
    // During setup mode, only allow provider selection and setup-related questions
    if (isSetupMode) {
      const userInput = inputValue.toLowerCase();
      const providers = ['openai', 'anthropic', 'google'];
      const matchedProvider = providers.find(p => userInput.includes(p));
      
      const userMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'user' as const,
        content: inputValue.trim(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);
      
      if (matchedProvider) {
        handleProviderSetup(matchedProvider);
        setIsTyping(false);
        return;
      }
      
      // If not selecting a provider, guide user back to setup
      const assistantMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant' as const,
        content: `I'm here to help you get set up! Please choose one of these AI providers:

• OpenAI (GPT-4) - Most versatile, great for general tasks
• Anthropic (Claude) - Excellent for analysis and long-form content
• Google (Gemini) - Strong technical and coding capabilities

For example, type "use OpenAI" or "I want to use Claude".`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      return;
    }


    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Check for provider selection during setup
    if (isSetupMode) {
      const providers = ['openai', 'anthropic', 'google'];
      const matchedProvider = providers.find(p => userMessage.content.toLowerCase().includes(p.toLowerCase()));
      
      if (matchedProvider) {
        handleProviderSetup(matchedProvider);
        setIsTyping(false);
        return;
      }
    }

    // Use OpenAI key from env if available and no other key is set
    const effectiveKey = apiKey || openaiKey;
    
    if (!effectiveKey) {
      const errorMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant' as const,
        content: "I'm not configured yet. Please add an API key in the settings or ask your administrator to configure the Copilot.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are ProPhone Copilot, an AI assistant for a marketing and phone system platform. You help users with campaign creation, workflow automation, analytics, and customer management.' },
            { role: 'system', content: useCopilot.getState().systemPrompt },
            { role: 'user', content: userMessage.content + '\n\nNote: You can perform actions using [ACTION:type|param=value] syntax.' }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }
      
      const aiResponse = data.choices[0].message.content;

      const assistantMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (onNewMessage) {
        onNewMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant' as const,
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