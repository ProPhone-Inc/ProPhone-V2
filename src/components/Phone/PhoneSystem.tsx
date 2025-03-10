import React from 'react';
import { Phone, MessageSquare, Plus, Mic, Video, MoreVertical, Send, Paperclip, User, Users, Clock, Star, Filter, ChevronDown, CheckCircle, Search, Network } from 'lucide-react';
import { useResizable } from '../../hooks/useResizable';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNotifications } from '../../hooks/useNotifications';
import { ProviderModal } from './ProviderModal';

interface PhoneSystemProps {
  selectedMessage: string | null;
  selectedChat: string | null;
  onMessageSelect?: (messageId: string | null) => void;
}

export function PhoneSystem({ selectedMessage, selectedChat, onMessageSelect }: PhoneSystemProps) {
  const [activeTab, setActiveTab] = React.useState<'crm' | 'audience'>('crm');
  const { sendNotification } = useNotifications();
  const [selectedLine, setSelectedLine] = React.useState<string | null>(null);
  const [messageInput, setMessageInput] = React.useState('');
  const [currentChat, setCurrentChat] = React.useState<string | null>(null);
  const [showProviderModal, setShowProviderModal] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setShowProviderModal(false);
    setSelectedLine(null); // Reset selected line when changing provider
  };

  const [conversations, setConversations] = React.useState([
    // Existing conversations...
    // Line 1: Sales Team Chats
    {
      id: '1',
      lineId: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      messages: [{
        id: '1',
        content: "Hi, I'm interested in scheduling a viewing for the downtown property",
        time: '10:30 AM',
        type: 'received'
      },
      {
        id: '2',
        content: "I'd be happy to show you the property. When would be a good time for you?",
        time: '10:35 AM',
        type: 'sent'
      },
      {
        id: '3',
        content: 'Would tomorrow at 2 PM work?',
        time: '10:40 AM',
        type: 'received'
      }],
      lastMessage: 'Would tomorrow at 2 PM work?',
      time: '10:30 AM',
      unread: 3,
      status: 'online'
    },
    {
      id: '2', 
      name: 'Kevin Brown',
      avatar: 'KB',
      messages: [{
        id: '4',
        content: 'Reaching out about your investment property',
        time: '10:55 AM',
        type: 'received'
      },
      {
        id: '5',
        content: 'Which property are you interested in?',
        time: '11:00 AM',
        type: 'sent'
      },
      {
        id: '6',
        content: 'The one on Oak Street. Is it still available?',
        time: '11:05 AM',
        type: 'received'
      }],
      lastMessage: 'The one on Oak Street. Is it still available?',
      time: '10:55 AM',
      unread: 2,
      status: 'offline'
    },
    {
      id: '3',
      lineId: '2', // Property Management Line
      name: 'Emma Wilson',
      avatar: 'EW',
      messages: [{
        id: '7',
        content: 'Just wanted to confirm our appointment for tomorrow',
        time: '9:15 AM',
        type: 'received'
      },
      {
        id: '8',
        content: "Yes, we're all set for 3 PM at the Maple Avenue property",
        time: '9:20 AM',
        type: 'sent'
      }],
      lastMessage: "Yes, we're all set for 3 PM at the Maple Avenue property",
      time: '9:20 AM',
      unread: 0,
      status: 'online'
    },
    {
      id: '4',
      lineId: '1',
      name: 'Michael Chen',
      avatar: 'MC',
      messages: [{
        id: '9',
        content: "What's the square footage of the Pine Street listing?",
        time: '8:45 AM',
        type: 'received'
      }],
      lastMessage: "What's the square footage of the Pine Street listing?",
      time: '8:45 AM',
      unread: 1,
      status: 'offline',
    },
    // Line 2: Property Management Chats
    {
      id: '5',
      lineId: '2',
      name: 'Lisa Anderson',
      avatar: 'LA',
      messages: [{
        id: '10',
        content: 'Maintenance request for unit 4B',
        time: '11:30 AM',
        type: 'received'
      }],
      lastMessage: 'Maintenance request for unit 4B',
      time: '11:30 AM',
      unread: 1,
      status: 'online'
    },
    // Line 3: Rentals Chats
    {
      id: '6',
      lineId: '3',
      name: 'David Park',
      avatar: 'DP',
      messages: [{
        id: '11',
        content: 'Looking for a 2-bedroom apartment',
        time: '2:15 PM',
        type: 'received'
      }],
      lastMessage: 'Looking for a 2-bedroom apartment',
      time: '2:15 PM',
      unread: 1,
      status: 'online'
    }
  ]);

  // WebSocket message handler
  const handleNewMessage = React.useCallback((data: any) => {
    const { lineId, chatId, message } = data;
    
    setConversations(prev => prev.map(chat => {
      if (chat.id === chatId && chat.lineId === lineId) {
        // Send notification for new messages when chat isn't selected
        if (currentChat !== chatId) {
          sendNotification({
            title: chat.name,
            body: message.content,
            onClick: () => {
              setCurrentChat(chatId);
              setSelectedLine(lineId);
            }
          });
        }

        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.content,
          time: message.time,
          unread: currentChat !== chatId ? (chat.unread || 0) + 1 : 0
        };
      }
      return chat;
    }));
  }, [currentChat, sendNotification]);

  const { sendMessage } = useWebSocket(handleNewMessage);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentChat || !selectedLine) return;

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent'
    };

    // Update local state immediately
    setConversations(prev => prev.map(chat => {
      if (chat.id === currentChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.content,
          time: newMessage.time
        };
      }
      return chat;
    }));

    // Send message through WebSocket
    sendMessage({
      lineId: selectedLine,
      chatId: currentChat,
      message: newMessage
    });

    setMessageInput('');
  };

  // When a message is selected, automatically open the corresponding chat
  React.useEffect(() => {
    if (selectedChat) {
      const conversation = conversations.find(c => c.id === selectedChat);
      if (conversation) {
        setCurrentChat(selectedChat);
        
        if (selectedMessage) {
          // Find the message element and scroll to it
          const messageElement = document.getElementById(`message-${selectedMessage}`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageElement.classList.add('bg-[#FFD700]/10');
            setTimeout(() => messageElement.classList.remove('bg-[#FFD700]/10'), 2000);
          }
        }
      }
    }
  }, [selectedChat, onMessageSelect]);

  // Update conversations when a message is selected
  React.useEffect(() => {
    if (selectedMessage && selectedChat) {
      setConversations(prev => prev.map(conv => 
        conv.id === selectedChat
          ? {
              ...conv,
              unread: 0,
              messages: conv.messages.map(msg =>
                msg.id === selectedMessage ? { ...msg, read: true } : msg
              )
            }
          : conv
      ));
    }
  }, [selectedMessage, selectedChat]);

  // Resizable columns
  const phoneLinesColumn = useResizable({ defaultWidth: 280, minWidth: 240, maxWidth: 400, storageKey: 'phone-lines-width' });
  const chatsColumn = useResizable({ defaultWidth: 320, minWidth: 280, maxWidth: 480, storageKey: 'chats-width' });
  const crmColumn = useResizable({ defaultWidth: 320, minWidth: 280, maxWidth: 480, storageKey: 'crm-width' });

  // Updated phone lines with unread counts
  const phoneLines = [
    { 
      id: '1', 
      name: 'Sales Team', 
      number: '(555) 123-4567', 
      unread: 5,
      chats: [
        { id: '1', unread: 2 },
        { id: '2', unread: 2 },
        { id: '4', unread: 1 }
      ]
    },
    { 
      id: '2', 
      name: 'Property Management', 
      number: '(555) 987-6543',
      unread: 3,
      chats: [
        { id: '3', unread: 2 },
        { id: '5', unread: 1 }
      ]
    },
    { 
      id: '3', 
      name: 'Rentals', 
      number: '(555) 456-7890',
      unread: 2,
      chats: [
        { id: '6', unread: 1 },
        { id: '7', unread: 1 }
      ]
    },
    { 
      id: '4', 
      name: 'Marketing', 
      number: '(555) 234-5678',
      unread: 1,
      chats: [
        { id: '8', unread: 1 }
      ]
    },
    { 
      id: '5', 
      name: 'Investments', 
      number: '(555) 789-0123',
      unread: 2,
      chats: [
        { id: '9', unread: 1 },
        { id: '10', unread: 1 }
      ]
    }
  ];

  // Calculate total unread messages for a phone line
  const getLineUnreadCount = (line: typeof phoneLines[0]) => {
    return line.chats?.reduce((sum, chat) => sum + (chat.unread || 0), 0) || 0;
  };

  const chats = [
    {
      id: '1',
      name: 'Emily Parker',
      avatar: 'EP',
      lastMessage: 'Looking forward to our meeting tomorrow at 2 PM',
      time: '10:30 AM',
      unread: 3,
      status: 'online'
    },
    {
      id: '2',
      lineId: '1',
      name: 'Kevin Brown',
      avatar: 'KB',
      lastMessage: 'Reaching out about your investment property',
      time: '10:55 AM',
      status: 'offline'
    },
    // Add more chats...
  ];

  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex border-b border-[#B38B3F]/20">
      {/* Phone Lines Column */}
      <div
        className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/70 flex flex-col relative group"
        style={{ width: phoneLinesColumn.width }}
      >
        <div className="p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-bold text-white">Inboxes</h2>
              <button 
                onClick={() => setShowProviderModal(true)}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30 hover:bg-[#B38B3F]/30 transition-colors"
              >
                <Network className="w-4 h-4 text-[#FFD700]" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search lines..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {phoneLines
            .filter(line => !selectedProvider || providers.find(p => p.id === selectedProvider)?.lines.includes(line.id))
            .map((line) => (
            <button
              key={line.id}
              onClick={() => setSelectedLine(line.id)}
              className={`w-full p-4 text-left transition-colors relative ${
                selectedLine === line.id
                  ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border-l-2 border-[#FFD700] shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <div className="font-medium text-white">{line.name}</div>
                  <div className="text-sm text-white/60">{line.number}</div>
                </div>
              </div>
              {getLineUnreadCount(line) > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 min-w-[20px] h-5 rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1">
                  {getLineUnreadCount(line)}
                </div>
              )}
            </button>
          ))}
        </div>
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${phoneLinesColumn.isResizing ? 'resizing' : ''}`}
          onMouseDown={phoneLinesColumn.handleMouseDown}
        />
      </div>

      {/* Chat Selection Column */}
      <div 
        className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/60 flex flex-col relative group"
        style={{ width: chatsColumn.width }}
      >
        <div className="sticky top-0 z-10 p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Chats</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-[#FFD700]" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5 text-[#FFD700]" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </button>
            </div>
          </div>
        </div>
        {selectedLine ? (
          <div className="flex-1 overflow-y-auto relative">
          {conversations.filter(chat => chat.lineId === selectedLine).map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChat(chat.id)}
              className={`w-full p-4 text-left transition-colors relative ${
                currentChat === chat.id
                  ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border-l-2 border-[#FFD700] shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                    {chat.avatar}
                  </div>
                  {chat.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0 w-[calc(100%-120px)]">
                  <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">{chat.name}</div>
                  <div className="text-sm text-white/60 whitespace-nowrap overflow-hidden text-ellipsis">{chat.lastMessage}</div>
                </div>
                <div className="ml-3 w-16 flex-shrink-0">
                  <div className="text-xs text-white/40 text-right">{chat.time}</div>
                  {chat.unread > 0 && (
                    <div className="mt-1 min-w-[18px] h-[18px] rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1 ml-auto">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
           </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/40 text-center p-8">
            <div>
              <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Congratulations!</h3>
              <p className="text-white/60">You are all caught up!</p>
            </div>
          </div>
        )}
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${chatsColumn.isResizing ? 'resizing' : ''}`}
          onMouseDown={chatsColumn.handleMouseDown}
        />
      </div>

      {/* Message Area Column */}
      <div className="h-full flex-1 bg-zinc-900/50 flex flex-col">
        {selectedLine && currentChat && conversations.find(c => c.id === currentChat) && (
          <>
            <div className="p-4 border-b border-[#B38B3F]/20 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700]">
                  {conversations.find(c => c.id === currentChat)?.avatar}
                </div>
                <div>
                  <div className="font-medium text-white">{conversations.find(c => c.id === currentChat)?.name}</div>
                  <div className="text-sm text-white/60">Online</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversations.find(c => c.id === currentChat)?.messages.map((message) => (
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
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="w-full pl-4 pr-10 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <Mic className="w-5 h-5 text-[#FFD700]" />
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-[#FFD700] hover:bg-[#FFD700]/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CRM/Audience Column */}
      <div 
        className="h-full bg-zinc-900/80 flex flex-col relative group"
        style={{ width: crmColumn.width }}
      >
        <div className="p-4 border-b border-[#B38B3F]/20">
          <div className="flex">
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'crm'
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-[#FFD700]/10'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              CRM
            </button>
            <button
              onClick={() => setActiveTab('audience')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'audience'
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-[#FFD700]/10'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Audience
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'crm' ? (
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Contact Info</h3>
                  <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                    Edit
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white/70">
                    <User className="w-4 h-4" />
                    <span>John Doe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70">
                    <MessageSquare className="w-4 h-4" />
                    <span>john.doe@example.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Recent Activity</h3>
                  <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-white/40 mt-1" />
                    <div>
                      <div className="text-sm text-white">Phone call - 5 mins</div>
                      <div className="text-xs text-white/40">Yesterday at 2:30 PM</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-white/40 mt-1" />
                    <div>
                      <div className="text-sm text-white">Email sent</div>
                      <div className="text-xs text-white/40">Yesterday at 1:15 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Notes</h3>
                  <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                    Add Note
                  </button>
                </div>
                <div className="text-sm text-white/70">
                  Interested in 3-bedroom properties in the downtown area. Budget: $500k-750k
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Audience Segments</h3>
                  <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                    Create New
                  </button>
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-white">High-Value Leads</span>
                    </div>
                    <span className="text-white/40">1,234</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-white">VIP Clients</span>
                    </div>
                    <span className="text-white/40">567</span>
                  </button>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Analytics</h3>
                  <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center">
                    This Week <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Reach</span>
                    <span className="text-white">12,345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Engagement Rate</span>
                    <span className="text-white">4.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Conversion Rate</span>
                    <span className="text-white">2.3%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${crmColumn.isResizing ? 'resizing' : ''}`}
          onMouseDown={crmColumn.handleMouseDown}
        />
      </div>

      {/* Overlay to prevent text selection while resizing */}
      {(phoneLinesColumn.isResizing || chatsColumn.isResizing || crmColumn.isResizing) && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}
      
      {showProviderModal && (
        <ProviderModal
          onClose={() => setShowProviderModal(false)}
          onSelect={handleProviderSelect}
          selectedProvider={selectedProvider}
        />
      )}
    </div>
  );
}