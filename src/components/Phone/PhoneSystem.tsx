import React from 'react';
import { Home, Phone, MessageSquare } from 'lucide-react';
import { useResizable } from '../../hooks/useResizable';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNotifications } from '../../hooks/useNotifications';
import { ProviderModal } from './ProviderModal';
import { PhoneLinesList } from './components/PhoneLinesList';
import { ChatsList } from './components/ChatsList';
import { ChatArea } from './components/ChatArea';
import { CRMPanel } from './components/CRMPanel';
import type { PhoneLine, Chat } from '../../modules/phone/types';
import type { PhoneSystemProps } from '../../modules/phone/types';

const providers = [
  {
    id: 'att',
    name: 'AT&T',
    logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/att.png',
    lines: ['1', '2']
  },
  {
    id: 'verizon',
    name: 'Verizon',
    logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/verizon.png',
    lines: ['3', '4']
  },
  {
    id: 'tmobile',
    name: 'T-Mobile',
    logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/tmobile.png',
    lines: ['5']
  }
];

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

export function PhoneSystem({ selectedMessage, selectedChat, onMessageSelect }: PhoneSystemProps) {
  const [activeTab, setActiveTab] = React.useState<'crm' | 'audience'>('crm');
  const { sendNotification } = useNotifications();
  const [selectedLine, setSelectedLine] = React.useState<string | null>(() => {
    // Auto-select first line if available
    return phoneLines.length > 0 ? phoneLines[0].id : null;
  });
  const [messageInput, setMessageInput] = React.useState('');
  const [currentChat, setCurrentChat] = React.useState<string | null>(null);
  const [showProviderModal, setShowProviderModal] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [localPhoneLines, setLocalPhoneLines] = React.useState(phoneLines);
  const [draftChat, setDraftChat] = React.useState<Chat | null>(null);
  const [isCreatingMessage, setIsCreatingMessage] = React.useState(false);
  const [newMessageNumber, setNewMessageNumber] = React.useState('');
  const [isDraft, setIsDraft] = React.useState(false);

  // Effect to handle initial line selection when phone lines change
  React.useEffect(() => {
    if (!selectedLine && localPhoneLines.length > 0) {
      setSelectedLine(localPhoneLines[0].id);
    }
  }, [selectedLine, localPhoneLines]);

  const handleReorderLines = React.useCallback((startIndex: number, endIndex: number) => {
    setLocalPhoneLines(prev => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const [chatStatuses, setChatStatuses] = React.useState<Record<string, { label: string; icon: React.ReactNode }>>({});

  const [conversations, setConversations] = React.useState<Chat[]>([
    {
      id: '1',
      lineId: '1',
      name: 'Sarah Johnson',
      number: '(555) 123-4567',
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
      unread: 3
    },
    {
      id: '2',
      lineId: '1',
      name: 'Kevin Brown',
      number: '(555) 987-6543',
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
      unread: 2
    },
    {
      id: '3',
      lineId: '2',
      name: 'Emma Wilson',
      number: '(555) 456-7890',
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
      unread: 0
    }
  ]);

  // Initialize phone lines with correct unread counts from conversations
  React.useEffect(() => {
    setLocalPhoneLines(prev => prev.map(line => {
      const lineChats = line.chats.map(chat => {
        const conversation = conversations.find(c => c.id === chat.id);
        return {
          ...chat,
          unread: conversation?.unread || chat.unread || 0
        };
      });
      
      const lineUnread = lineChats.reduce((sum, chat) => sum + chat.unread, 0);
      
      return {
        ...line,
        chats: lineChats,
        unread: lineUnread
      };
    }));
  }, [conversations]);

  // Handle clicking outside and app blur
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside the phone system
      const phoneSystem = document.querySelector('.phone-system');
      if (phoneSystem && !phoneSystem.contains(e.target as Node)) {
        if (isCreatingMessage) {
          setIsCreatingMessage(false);
          setIsDraft(false);
          setDraftChat(null);
          setNewMessageNumber('');
        }
      }
    };

    const handleBlur = () => {
      if (isCreatingMessage) {
        setIsCreatingMessage(false);
        setIsDraft(false);
        setDraftChat(null);
        setNewMessageNumber('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isCreatingMessage]);

  // Update total unread count and header when phone lines change
  React.useEffect(() => {
    const total = localPhoneLines.reduce((sum, line) => {
      return sum + (line.chats?.reduce((chatSum, chat) => chatSum + (chat.unread || 0), 0) || 0);
    }, 0);

    if (onMessageSelect && total > 0) {
      onMessageSelect(total.toString());
    }
  }, [localPhoneLines, onMessageSelect]);

  // Update unread counts when chat is selected
  React.useEffect(() => {
    if (currentChat && selectedLine) {
      // Mark messages as read in the selected chat
      setConversations(prev => {
        const updated = prev.map(chat => 
          chat.id === currentChat ? { ...chat, unread: 0 } : chat
        );
        return updated;
      });
      
      // Update phone line's unread count based on conversations
      setLocalPhoneLines(prev => prev.map(line => {
        if (line.id === selectedLine) {
          const updatedChats = line.chats.map(chat => ({
            ...chat,
            unread: chat.id === currentChat ? 0 : chat.unread
          }));
          
          const lineUnread = updatedChats.reduce((sum, chat) => sum + chat.unread, 0);
          
          return {
            ...line,
            chats: updatedChats,
            unread: lineUnread
          };
        }
        return line;
      }));
    }
  }, [currentChat, selectedLine]);

  // Calculate total unread messages for a phone line
  const getLineUnreadCount = React.useCallback((line: PhoneLine) => {
    const lineChats = conversations.filter(chat => chat.lineId === line.id);
    return lineChats.reduce((sum, chat) => sum + (chat.unread || 0), 0);
  }, [conversations]);

  // WebSocket message handler
  const handleNewMessage = React.useCallback((data: any) => {
    const { lineId, chatId, message } = data;

    // Update phone line and chat unread counts
    setLocalPhoneLines(prev => prev.map(line => {
      if (line.id === lineId) {
        const updatedChats = line.chats.map(chat => {
          if (chat.id === chatId) {
            const newUnread = currentChat !== chatId ? chat.unread + 1 : 0;
            return { ...chat, unread: newUnread };
          }
          return chat;
        });
        
        const lineUnread = updatedChats.reduce((sum, chat) => sum + chat.unread, 0);
        
        // Update total unread count in header
        if (onMessageSelect) {
          const totalUnread = prev.reduce((sum, l) => {
            if (l.id === line.id) {
              return sum + lineUnread;
            }
            return sum + l.unread;
          }, 0);
          onMessageSelect(totalUnread.toString());
        }
        
        return {
          ...line,
          chats: updatedChats,
          unread: lineUnread
        };
      }
      return line;
    }));
    
    // Get current status or use default "New" status
    const currentStatus = chatStatuses[chatId] || {
      label: 'New',
      icon: <Home className="w-4 h-4 text-emerald-400" />
    };

    // Update chat statuses if needed
    if (!chatStatuses[chatId] || chatStatuses[chatId].label !== currentStatus.label) {
      setChatStatuses(prev => ({
        ...prev,
        [chatId]: currentStatus
      }));
    }
    
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
          unread: currentChat !== chatId ? (chat.unread || 0) + 1 : 0,
          messageStatus: currentStatus
        };
      }
      return chat;
    }));
  }, [currentChat, sendNotification, chatStatuses, conversations]);

  const handleStartNewMessage = () => {
    if (!selectedLine) return;
    setIsCreatingMessage(true);
    setCurrentChat(null);
    setIsDraft(true);
    // Create a draft chat
    setDraftChat({
      id: 'draft',
      lineId: selectedLine,
      name: 'New Message',
      avatar: 'NM',
      messages: [],
      lastMessage: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0
    });
    setNewMessageNumber('');
  };

  // Clear draft when changing lines or closing new message
  React.useEffect(() => {
    if (!isCreatingMessage && isDraft) {
      setDraftChat(null);
      setIsDraft(false);
      setNewMessageNumber('');
    }
  }, [isCreatingMessage, isDraft]);

  const { sendMessage } = useWebSocket(handleNewMessage);

  const handleSendMessage = React.useCallback(() => {
    if (!messageInput.trim() || !currentChat || !selectedLine) return;

    const currentStatus = chatStatuses[currentChat];

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
          time: newMessage.time,
          messageStatus: currentStatus
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
  }, [messageInput, currentChat, selectedLine, chatStatuses, sendMessage]);

  // Initialize chat statuses after conversations are defined
  React.useEffect(() => {
    const initialStatuses: Record<string, { label: string; icon: React.ReactNode }> = {};
    const defaultStatus = { label: 'New', icon: <Home className="w-4 h-4 text-emerald-400" /> };
    
    conversations.forEach(chat => {
      initialStatuses[chat.id] = chat.messageStatus || defaultStatus;
    });
    setChatStatuses(initialStatuses);
  }, []);

  // Resizable columns
  const phoneLinesColumn = useResizable({ defaultWidth: 280, minWidth: 240, maxWidth: 400, storageKey: 'phone-lines-width' });
  const chatsColumn = useResizable({ defaultWidth: 320, minWidth: 280, maxWidth: 480, storageKey: 'chats-width' });
  const crmColumn = useResizable({ defaultWidth: 320, minWidth: 280, maxWidth: 480, storageKey: 'crm-width' });

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setShowProviderModal(false);
  };

  const handleStartChat = () => {
    if (!newMessageNumber.trim() || !selectedLine) return;
    
    // Handle group message creation
    const numbers = newMessageNumber.includes(',') 
      ? newMessageNumber.split(',').map(n => n.trim())
      : [newMessageNumber];
    
    // Generate new chat ID
    const newChatId = Math.random().toString(36).substr(2, 9);
    
    // Set default status for new chat
    setChatStatuses(prev => ({
      ...prev,
      [newChatId]: {
        label: 'New',
        icon: <Home className="w-4 h-4 text-emerald-400" />
      }
    }));
    
    // Create new chat
    setIsDraft(false);
    const newChat: Chat = {
      id: newChatId,
      lineId: selectedLine,
      name: numbers.length > 1 ? `Group (${numbers.length})` : numbers[0],
      number: numbers.length > 1 ? null : numbers[0],
      isGroup: numbers.length > 1,
      avatar: numbers.length > 1 ? 'G' : 'NC',
      messages: [],
      lastMessage: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      messageStatus: {
        label: 'New',
        icon: <Home className="w-4 h-4 text-emerald-400" />
      }
    };

    setConversations(prev => [...prev, newChat]);
    setCurrentChat(newChat.id);
    setIsCreatingMessage(false);
    setDraftChat(null);
    setNewMessageNumber('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex border-b border-[#B38B3F]/20 phone-system">
      {/* Phone Lines Column */}
      <PhoneLinesList
        width={phoneLinesColumn.width}
        isResizing={phoneLinesColumn.isResizing}
        onResizeStart={phoneLinesColumn.handleMouseDown}
        phoneLines={localPhoneLines}
        selectedLine={selectedLine}
        selectedProvider={selectedProvider}
        providers={providers}
        conversations={conversations}
        onLineSelect={setSelectedLine}
        onProviderClick={() => setShowProviderModal(true)}
        onReorder={handleReorderLines}
      />

      {/* Chats Column */}
      <ChatsList
        width={chatsColumn.width}
        isResizing={chatsColumn.isResizing}
        onResizeStart={chatsColumn.handleMouseDown}
        selectedLine={selectedLine}
        currentChat={currentChat}
        conversations={draftChat ? [...conversations, draftChat] : conversations}
        onChatSelect={setCurrentChat}
        onNewMessage={handleStartNewMessage}
        chatStatuses={chatStatuses}
      />

      {/* Chat Area */}
      <div className="h-full flex-1 bg-zinc-900/50 flex flex-col relative">
        {!selectedLine ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-center p-8">
            <div>
              <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select a Line</h3>
              <p className="text-white/60">Choose a phone line to start a draft message</p>
            </div>
          </div>
        ) : (
          <ChatArea
            selectedChat={conversations.find(c => c.id === currentChat) || null}
            messageInput={messageInput}
            onInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            isCreatingMessage={isCreatingMessage}
            setIsCreatingMessage={setIsCreatingMessage}
            newMessageNumber={newMessageNumber}
            onNewMessageChange={setNewMessageNumber}
            onStartChat={handleStartChat}
            chatStatuses={chatStatuses}
            onStatusChange={(chatId, status) => {
              setChatStatuses(prev => ({
                ...prev,
                [chatId]: status
              }));
            }}
          />
        )}
      </div>

      {/* CRM Panel */}
      {selectedLine && currentChat && (
        <CRMPanel
          width={crmColumn.width}
          isResizing={crmColumn.isResizing}
          onResizeStart={crmColumn.handleMouseDown}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedChat={conversations.find(c => c.id === currentChat) || null}
        />
      )}

      {/* Provider Modal */}
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