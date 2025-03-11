import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCopilot } from '../../hooks/useCopilot'; 

interface Action {
  type: 'open';
  target: string;
  label: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Action[];
}

interface SavedChat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export function CopilotBubble() {
  const { apiKey, provider } = useCopilot();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [savedChats, setSavedChats] = React.useState<SavedChat[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [shouldPlaySound, setShouldPlaySound] = React.useState(false);
  const notificationSound = React.useRef<HTMLAudioElement | null>(null);
  const [hasUnreadMessage, setHasUnreadMessage] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(false);
  const welcomeMessageRef = React.useRef<boolean>(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const welcomeMessageTimeout = React.useRef<number | null>(null);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = React.useState(false);
  const lastMessageId = React.useRef<string | null>(null);
  const readMessageIds = React.useRef<Set<string>>(new Set());
  const [providerConfig, setProviderConfig] = React.useState<{
    endpoint: string;
    headers: HeadersInit;
    buildBody: (content: string) => any;
    extractResponse: (data: any) => string;
  } | null>(null);
  
  // Show welcome message when component mounts
  React.useEffect(() => {
    if (welcomeMessageRef.current) return;
    
    // Initialize audio immediately
    initializeAudio();
    
    // Set welcome message after 5 seconds
    welcomeMessageTimeout.current = window.setTimeout(() => {
      welcomeMessageRef.current = true;
      
      // Check if CoPilot needs setup
      const needsSetup = !provider || !apiKey;
      setNeedsSetup(needsSetup);

      // Only set welcome message if no messages exist
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'assistant',
          content: needsSetup ? getWelcomeMessage() : "Hi there! 👋 I'm Dawson, your ProPhone CoPilot. I'm ready to help with calls, automation workflows, templates, designs, and more. How can I assist you today?",
          timestamp: new Date()
        };

        setMessages([welcomeMessage]);
        setShowWelcomeMessage(true);
      }
    }, 5000);
    
    return () => {
      if (welcomeMessageTimeout.current) {
        clearTimeout(welcomeMessageTimeout.current);
      }
    }
  }, [provider, apiKey, messages]);

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
        video: "https://www.youtube.com/embed/DEF456", // Replace with actual video ID
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
        video: "https://www.youtube.com/embed/GHI789", // Replace with actual video ID
        docs: "https://ai.google.dev/docs"
      }
    };
    return instructions[provider as keyof typeof instructions];
  };

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

    const assistantMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assistant',
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

  // Initialize audio only when needed
  const initializeAudio = () => {
    if (!notificationSound.current) {
      const audio = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/CoPilot.wav');
      audio.preload = 'auto';
      notificationSound.current = audio;
      notificationSound.current.volume = 0.3;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, showWelcomeMessage]);
  
  // Handle unread messages and notifications
  React.useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].type === 'assistant') {
      const lastMessage = messages[messages.length - 1];
      
      // Only play sound for new messages we haven't seen
      if (shouldPlaySound && lastMessage.id !== lastMessageId.current) {
        notificationSound.current?.play()
          .catch(() => console.log('Audio playback was prevented'));
        lastMessageId.current = lastMessage.id;
      }

      // Only increment unread count for new assistant messages when chat is closed
      if (!readMessageIds.current.has(lastMessage.id)) {
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
          setHasUnreadMessage(true);
        } else {
          // Mark as read immediately if chat is open
          readMessageIds.current.add(lastMessage.id);
        }
      }
    }
  }, [messages, isOpen, shouldPlaySound]);

  // Reset unread count and mark messages as read when opening chat
  React.useEffect(() => {
    if (isOpen && messages.length > 0) {
      messages.forEach(message => {
        if (message.type === 'assistant') {
          readMessageIds.current.add(message.id);
        }
      });
      setUnreadCount(0);
      setHasUnreadMessage(false);
    }
  }, [isOpen, messages]);

  // Set up provider config when provider/key changes
  React.useEffect(() => {
    if (!provider || !apiKey) return;

    const configs = {
      openai: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        buildBody: (content: string) => ({
          model: 'gpt-4',
          messages: [{ role: 'user', content }],
          temperature: 0.7,
          max_tokens: 150
        }),
        extractResponse: (data: any) => data.choices[0].message.content
      },
      anthropic: {
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        buildBody: (content: string) => ({
          model: 'claude-2',
          max_tokens_to_sample: 150,
          messages: [{ role: 'user', content }]
        }),
        extractResponse: (data: any) => data.content[0].text
      },
      google: {
        endpoint: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
        headers: {
          'Content-Type': 'application/json'
        },
        buildBody: (content: string) => ({
          contents: [{ parts: [{ text: content }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150
          }
        }),
        extractResponse: (data: any) => data.candidates[0].content.parts[0].text
      }
    };

    setProviderConfig(configs[provider]);
  }, [provider, apiKey]);

  // Enable sound when component mounts
  React.useEffect(() => {
    setShouldPlaySound(true);
    initializeAudio(); // Initialize audio immediately
    return () => setShouldPlaySound(false);
  }, []);

  const saveCurrentChat = () => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    const title = messages[0].content.slice(0, 30) + '...';
    
    const newChat: SavedChat = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      lastMessage: lastMessage.content,
      timestamp: new Date(),
      unread: true
    };
    
    setSavedChats(prev => [newChat, ...prev]);
  };

  const markChatAsRead = (chatId: string) => {
    setSavedChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, unread: false } : chat
      )
    );
  };

  const getUnreadCount = () => {
    return savedChats.filter(chat => chat.unread).length;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    // Ensure audio is initialized
    initializeAudio();
    
    // Add user message immediately
    const userInput = inputValue.trim().toLowerCase();
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Handle provider selection during setup
    if (needsSetup) {
      const providers = ['openai', 'anthropic', 'google'];
      const matchedProvider = providers.find(p => userInput.toLowerCase().includes(p.toLowerCase()));
      
      if (matchedProvider) {
        handleProviderSetup(matchedProvider);
        setIsTyping(false);
        return;
      }
      
      // If no provider matched but user is trying to select one
      if (userInput.toLowerCase().includes('choose') || userInput.toLowerCase().includes('select') || userInput.toLowerCase().includes('use')) {
        const assistantMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'assistant',
          content: `Hi, I'm Dawson! Please choose one of these providers by typing its name:

• OpenAI (GPT-4) - Most versatile, great for general tasks
• Anthropic (Claude) - Excellent for analysis and long-form content
• Google (Gemini) - Strong technical and coding capabilities

For example, type "use OpenAI" or "choose Anthropic".`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        return;
      }
    }

    // Extract any application opening commands
    const openMatch = inputValue.toLowerCase().match(/open\s+(\w+)/);
    if (openMatch) {
      const app = openMatch[1];
      window.location.href = `/${app}`;
      
      const userMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'user',
        content: `Opening ${app}...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      return;
    }

    // Only show configuration message to owner
    if (user?.role === 'owner' && (!apiKey || !provider)) {
      setTimeout(() => {
        const response = "I'm not fully configured yet. Please ask an admin to set up my API key in the CoPilot settings.";
        const assistantMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      if (!providerConfig) {
        throw new Error('API provider not configured');
      }

      const response = await fetch(providerConfig.endpoint, {
        method: 'POST',
        headers: providerConfig.headers,
        body: JSON.stringify(providerConfig.buildBody(userMessage.content))
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      const aiResponse = providerConfig.extractResponse(data);
      
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

      if (aiResponse) {
        const assistantMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('API call failed:', error);
      
      // Fallback to mock responses if API fails
      const lowerQuestion = userMessage.content.toLowerCase();
      let fallbackResponse = '';

      if (lowerQuestion.includes('campaign')) {
        fallbackResponse = "I can help you create a new campaign. Would you like me to:\n1. Open the campaign creator\n2. Show campaign templates\n3. Guide you through setup";
      } else if (lowerQuestion.includes('metric')) {
        fallbackResponse = "I'll help you analyze your metrics:\n- Your open rate is 24% (↑5%)\n- Click-through rate: 3.8% (↑2%)\n- Conversion rate: 2.1% (↑1%)\n\nWould you like me to generate a detailed report?";
      } else if (lowerQuestion.includes('automation')) {
        fallbackResponse = "Let's optimize your workflow:\n1. Review current automations\n2. Identify bottlenecks\n3. Set up new triggers\n4. Test and monitor\n\nShall we start with a workflow audit?";
      } else {
        fallbackResponse = "I'm here to help! You can ask me about:\n- Creating campaigns\n- Analyzing metrics\n- Optimizing workflows\n- Managing contacts\n- And more!";
      }

      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSubmit();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen && (
        <div className="absolute bottom-[calc(100%+1rem)] right-0 w-96 z-[201]">
          {/* Main Chat Window */}
          <div className="bg-black border border-[#B38B3F]/30 rounded-2xl shadow-2xl transform-gpu animate-fade-up">
            <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
                ProPhone Copilot
              </h3>
              <p className="text-white/70 text-sm">Your AI assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-black font-medium shadow-lg shadow-[#FFD700]/10'
                      : 'bg-zinc-800 text-white'
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
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <div className="px-4 pb-4">
              <p className="text-white/70 text-sm mb-3">Quick questions:</p>
              <div className="space-y-2">
                <button
                  onClick={() => handleQuickQuestion("How do I create a new campaign?")}
                  className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-[#FFD700] hover:bg-white/5 rounded-lg transition-colors"
                >💡 Show me how to create a campaign</button>
                <button
                  onClick={() => handleQuickQuestion("Can you analyze my metrics?")}
                  className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-[#FFD700] hover:bg-white/5 rounded-lg transition-colors"
                >📊 Help me analyze my metrics</button>
                <button
                  onClick={() => handleQuickQuestion("How can I optimize my automation workflow?")}
                  className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-[#FFD700] hover:bg-white/5 rounded-lg transition-colors"
                >⚡️ Optimize my automation workflow</button>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-[#B38B3F]/20">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-zinc-800/90 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38B3F]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          hasUnreadMessage ? 'animate-pulse' : ''
        }`}
      >
        <Sparkles className={`w-6 h-6 z-10 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
        
        {/* Soundwave rings */}
        <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 animate-[soundwave_2s_ease-out_infinite]" />
        <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 animate-[soundwave_2s_ease-out_infinite_0.75s]" />
        <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 animate-[soundwave_2s_ease-out_infinite_1.5s]" />
        
        {hasUnreadMessage && (
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FFD700] border-2 border-black text-xs font-bold flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}