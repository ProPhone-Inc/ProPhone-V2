import React from 'react';
import { Home, Phone, MessageSquare } from 'lucide-react';
import { useResizable } from '../../hooks/useResizable';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNotifications } from '../../hooks/useNotifications';
import { useSystemNotifications } from '../../hooks/useSystemNotifications';
import { isValidPhoneNumber } from '../../utils/phone';
import { SMSAutomation } from './components/SMSAutomation';
import { CallLogs } from './components/CallLogs';
import { ProviderModal } from './ProviderModal';
import { SearchModal } from './components/SearchModal';
import { PhoneLinesList } from './components/PhoneLinesList';
import { ChatsList } from './components/ChatsList';
import { PhoneCallModal } from './components/PhoneCallModal';
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

export function PhoneSystem({ selectedMessage, selectedChat, onMessageSelect, activePage = 'phone' }: PhoneSystemProps) {
  const [activeTab, setActiveTab] = React.useState<'crm' | 'audience'>('crm');
  const { sendNotification } = useNotifications();
  const { addNotification } = useSystemNotifications();
  const [selectedLine, setSelectedLine] = React.useState<string | null>(() => {
    // Auto-select first line if available
    return phoneLines.length > 0 ? phoneLines[0].id : null;
  });
  const [selectedChats, setSelectedChats] = React.useState<string[]>([]);
  const [messageInput, setMessageInput] = React.useState('');
  const [currentChat, setCurrentChat] = React.useState<string | null>(null);
  const [showProviderModal, setShowProviderModal] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [localPhoneLines, setLocalPhoneLines] = React.useState(phoneLines);
  const [draftChat, setDraftChat] = React.useState<Chat | null>(null);
  const [isCreatingMessage, setIsCreatingMessage] = React.useState(false);
  const [newMessageNumber, setNewMessageNumber] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [isDraft, setIsDraft] = React.useState(false);
  const [showCallModal, setShowCallModal] = React.useState(false);
  const [callContact, setCallContact] = React.useState<{name?: string; number: string} | null>(null);
  const [messageQueue, setMessageQueue] = React.useState<Record<string, 'queued' | 'sending' | 'delivered' | 'failed'>>({});
  const [activeView, setActiveView] = React.useState<'messages' | 'call-logs' | 'sms-automation'>('messages');
  const [scheduledMessages, setScheduledMessages] = React.useState<Array<{
    id: string;
    chatId: string;
    content: string;
    scheduledFor: Date;
  }>>([]);
  const [retryQueue, setRetryQueue] = React.useState<Set<string>>(new Set());
  const [attachedFiles, setAttachedFiles] = React.useState<any[]>([]);
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

  // Resizable columns
  const phoneLinesColumn = useResizable({ defaultWidth: 280, minWidth: 240, maxWidth: 400, storageKey: 'phone-lines-width' });
  const chatsColumn = useResizable({ defaultWidth: 320, minWidth: 280, maxWidth: 480, storageKey: 'chats-width' });
  const crmColumn = useResizable({ defaultWidth: 320, minWidth: 280, maxWidth: 480, storageKey: 'crm-width' });

  const handleLineNameChange = React.useCallback((lineId: string, newName: string) => {
    setLocalPhoneLines(prev => prev.map(line => 
      line.id === lineId ? { ...line, name: newName } : line
    ));
  }, []);

  const handleProviderSelect = React.useCallback((providerId: string) => {
    setSelectedProvider(providerId);
    setShowProviderModal(false);
  }, []);

  const handleMarkRead = React.useCallback((chatIds: string[]) => {
    setConversations(prev => prev.map(chat => {
      if (chatIds.includes(chat.id)) {
        return { ...chat, unread: 0 };
      }
      return chat;
    }));
    
    setLocalPhoneLines(prev => prev.map(line => {
      const lineChats = line.chats.map(chat => ({
        ...chat,
        unread: chatIds.includes(chat.id) ? 0 : chat.unread
      }));
      
      return {
        ...line,
        chats: lineChats,
        unread: lineChats.reduce((sum, chat) => sum + chat.unread, 0)
      };
    }));
    
    setSelectedChats([]);
  }, []);

  const handleMarkUnread = React.useCallback((chatIds: string[]) => {
    setConversations(prev => prev.map(chat => {
      if (chatIds.includes(chat.id)) {
        return { ...chat, unread: 1 };
      }
      return chat;
    }));
    
    setLocalPhoneLines(prev => prev.map(line => {
      const lineChats = line.chats.map(chat => ({
        ...chat,
        unread: chatIds.includes(chat.id) ? 1 : chat.unread
      }));
      
      return {
        ...line,
        chats: lineChats,
        unread: lineChats.reduce((sum, chat) => sum + chat.unread, 0)
      };
    }));
    
    setSelectedChats([]);
  }, []);

  const handleDeleteChats = React.useCallback((chatIds: string[]) => {
    setConversations(prev => prev.filter(chat => !chatIds.includes(chat.id)));
    
    setSelectedChats([]);
    
    if (currentChat && chatIds.includes(currentChat)) {
      setCurrentChat(null);
    }
  }, [currentChat]);

  const handleReorderLines = React.useCallback((startIndex: number, endIndex: number) => {
    setLocalPhoneLines(prev => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const handleMakeCall = React.useCallback((number: string) => {
    const chat = conversations.find(c => c.number === number || c.name === number);
    
    if (Notification.permission === 'granted') {
      const notification = new Notification('Incoming Call', {
        body: chat?.name || number,
        icon: '/vite.svg',
        tag: 'incoming-call',
        silent: false,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    addNotification({
      type: 'announcement',
      title: 'Incoming Call',
      message: `Call from ${chat?.name || number}`,
      priority: 'high'
    });

    setCallContact({
      name: chat?.name,
      number: chat?.number || number
    });
    setShowCallModal(true);
  }, [conversations, addNotification]);

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

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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

  React.useEffect(() => {
    const total = localPhoneLines.reduce((sum, line) => {
      return sum + (line.chats?.reduce((chatSum, chat) => chatSum + (chat.unread || 0), 0) || 0);
    }, 0);

    if (onMessageSelect && total > 0) {
      onMessageSelect(total.toString());
    }
  }, [localPhoneLines, onMessageSelect]);

  React.useEffect(() => {
    if (currentChat && selectedLine) {
      setConversations(prev => {
        const updated = prev.map(chat => 
          chat.id === currentChat ? { ...chat, unread: 0 } : chat
        );
        return updated;
      });
      
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

  const getLineUnreadCount = React.useCallback((line: PhoneLine) => {
    const lineChats = conversations.filter(chat => chat.lineId === line.id);
    return lineChats.reduce((sum, chat) => sum + (chat.unread || 0), 0);
  }, [conversations]);

  const handleNewMessage = React.useCallback((data: any) => {
    const { lineId, chatId, message } = data;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

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
    
    const currentStatus = chatStatuses[chatId] || {
      label: 'New',
      icon: <Home className="w-4 h-4 text-emerald-400" />
    };

    if (!chatStatuses[chatId] || chatStatuses[chatId].label !== currentStatus.label) {
      setChatStatuses(prev => ({
        ...prev,
        [chatId]: currentStatus
      }));
    }
    
    setConversations(prev => prev.map(chat => {
      if (chat.id === chatId && chat.lineId === lineId) {
        if (currentChat !== chatId) {
          if (Notification.permission === 'granted') {
            const notification = new Notification(chat.name, {
              body: message.content,
              icon: '/vite.svg',
              tag: 'new-message',
              silent: false
            });

            notification.onclick = () => {
              window.focus();
              setCurrentChat(chatId);
              setSelectedLine(lineId);
              notification.close();
            };
          }

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
  }, [currentChat, sendNotification, chatStatuses, conversations, onMessageSelect]);

  const { sendMessage } = useWebSocket(handleNewMessage);

  React.useEffect(() => {
    if (!selectedLine && localPhoneLines.length > 0) {
      setSelectedLine(localPhoneLines[0].id);
    }
  }, [selectedLine, localPhoneLines]);

  React.useEffect(() => {
    if (activePage === 'call-logs') {
      setActiveView('call-logs'); 
    } else if (activePage === 'sms-automation') {
      setActiveView('sms-automation');
    } else if (activePage === 'phone') {
      setActiveView('messages');
    }
  }, [activePage]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const messagesToSend = scheduledMessages.filter(msg => {
        return msg.scheduledFor <= now && !messageQueue[msg.id];
      });
      
      messagesToSend.forEach(msg => {
        const chat = conversations.find(c => c.id === msg.chatId);
        if (chat) {
          const newMessage = {
            id: msg.id,
            content: msg.content,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'sent' as const,
            status: 'queued' as const
          };
          
          setScheduledMessages(prev => prev.filter(m => m.id !== msg.id));
          
          setConversations(prev => prev.map(c => 
            c.id === chat.id 
              ? {
                  ...c,
                  messages: [...c.messages, newMessage],
                  lastMessage: newMessage.content,
                  time: newMessage.time
                }
              : c
          ));
          
          setMessageQueue(prev => ({
            ...prev,
            [newMessage.id]: 'queued'
          }));

          setTimeout(() => {
            setMessageQueue(prev => ({
              ...prev,
              [newMessage.id]: 'sending'
            }));

            setTimeout(() => {
              const success = Math.random() > 0.1;

              if (success) {
                setMessageQueue(prev => ({
                  ...prev,
                  [newMessage.id]: 'delivered'
                }));

                setConversations(prev => prev.map(c => {
                  if (c.id === chat.id) {
                    return {
                      ...c,
                      messages: c.messages.map(m => 
                        m.id === newMessage.id 
                          ? { ...m, status: 'delivered' }
                          : m
                      )
                    };
                  }
                  return c;
                }));

                sendMessage({
                  lineId: chat.lineId,
                  chatId: chat.id,
                  message: { ...newMessage, status: 'delivered' }
                });
              } else {
                setMessageQueue(prev => ({
                  ...prev,
                  [newMessage.id]: 'failed'
                }));

                setConversations(prev => prev.map(c => {
                  if (c.id === chat.id) {
                    return {
                      ...c,
                      messages: c.messages.map(m => 
                        m.id === newMessage.id 
                          ? { ...m, status: 'failed' }
                          : m
                      )
                    };
                  }
                  return c;
                }));
              }
            }, 1000);
          }, 500);
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [scheduledMessages, conversations, sendMessage]);

  const handleScheduleMessage = React.useCallback((date: Date) => {
    if (!messageInput.trim() || !currentChat) return;
    
    const messageId = Math.random().toString(36).substr(2, 9);
    
    const scheduledMessage = {
      id: messageId,
      chatId: currentChat,
      content: messageInput.trim(),
      scheduledFor: date,
      status: 'queued'
    };
    
    setScheduledMessages(prev => [...prev, scheduledMessage]);
    
    setConversations(prev => prev.map(chat => {
      if (chat.id === currentChat) {
        const newMessage = {
          id: messageId,
          content: messageInput.trim(),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'sent' as const,
          status: 'queued' as const,
          scheduledFor: date.toISOString(),
          scheduledDate: date.toLocaleDateString(),
          scheduledTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setTimeout(() => {
          setConversations(prev => prev.map(c => {
            if (c.id === currentChat) {
              return {
                ...c,
                messages: c.messages.map(m => 
                  m.id === messageId 
                    ? { ...m, status: 'scheduled' }
                    : m
                )
              };
            }
            return c;
          }));
        }, 1000);

        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: `⏰ Scheduled for ${newMessage.scheduledDate} at ${newMessage.scheduledTime}`,
          time: newMessage.time
        };
      }
      return chat;
    }));
    
    setMessageInput('');
  }, [messageInput, currentChat]);

  const handleStartNewMessage = () => {
    if (!selectedLine) return;
    setIsCreatingMessage(true);
    setSelectedChats([]);
    setCurrentChat(null);
    setIsDraft(true);
    setDraftChat({
      id: 'draft',
      lineId: selectedLine,
      name: newMessageNumber || 'New Message',
      avatar: 'MSG',
      messages: [],
      lastMessage: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0
    });
    setNewMessageNumber('');
    if (isValidPhoneNumber(newMessageNumber)) {
      const newChat = {
        id: Math.random().toString(36).substr(2, 9),
        lineId: selectedLine,
        name: newMessageNumber,
        number: newMessageNumber,
        avatar: 'MSG',
        messages: [],
        lastMessage: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0
      };
      
      setConversations(prev => [...prev, newChat]);
      
      setCurrentChat(newChat.id);
      
      setIsCreatingMessage(false);
      setIsDraft(false);
      setDraftChat(null);
      setNewMessageNumber('');
    }
  };

  const handleRetry = React.useCallback((messageId: string) => {
    const chat = conversations.find(c => 
      c.messages.some(m => m.id === messageId)
    );
    
    if (!chat) return;
    
    const messageIndex = chat.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = chat.messages[messageIndex];
    if (!message) return;

    setRetryQueue(prev => new Set(prev).add(messageId));

    const newMessage = {
      ...message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === chat.id) {
        const messages = [...c.messages];
        messages.splice(messageIndex, 1);
        messages.push(newMessage);

        return {
          ...c,
          messages,
          lastMessage: newMessage.content,
          time: newMessage.time
        };
      }
      return c;
    }));

    setTimeout(() => {
      const success = Math.random() > 0.5;
      
      setConversations(prev => prev.map(c => {
        if (c.id === chat.id) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === messageId) {
                return { ...m, status: success ? 'delivered' : 'failed' };
              }
              return m;
            })
          };
        }
        return c;
      }));

      setRetryQueue(prev => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });

      if (success) {
        sendMessage({
          lineId: chat.lineId,
          chatId: chat.id,
          message: { ...newMessage, status: 'delivered' }
        });
      }
    }, 2000);
  }, [conversations, sendMessage]);

  React.useEffect(() => {
    if (!isCreatingMessage && isDraft) {
      setDraftChat(null);
      setIsDraft(false);
      setNewMessageNumber('');
    }
  }, [isCreatingMessage, isDraft]);

  const handleSendMessage = React.useCallback(() => {
    if ((!messageInput.trim() && !attachedFiles.length) || !currentChat || !selectedLine) return;

    const messageId = Math.random().toString(36).substr(2, 9);

    const newMessage = {
      id: messageId,
      content: messageInput.trim(),
      attachments: attachedFiles,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent',
      status: 'queued'
    };

    setConversations(prev => prev.map(chat => {
      if (chat.id === currentChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageInput.trim() || `${attachedFiles.length} attachment${attachedFiles.length > 1 ? 's' : ''}`,
          time: newMessage.time
        };
      }
      return chat;
    }));

    setMessageInput('');
    setAttachedFiles([]);

    setMessageQueue(prev => ({
      ...prev,
      [messageId]: 'queued'
    }));

    setTimeout(() => {
      setMessageQueue(prev => ({
        ...prev,
        [messageId]: 'sending'
      }));

      setTimeout(() => {
        const success = Math.random() > 0.1;

        if (success) {
          setMessageQueue(prev => ({
            ...prev,
            [messageId]: 'delivered'
          }));

          setConversations(prev => prev.map(chat => {
            if (chat.id === currentChat) {
              return {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === messageId 
                    ? { ...msg, status: 'delivered' }
                    : msg
                )
              };
            }
            return chat;
          }));

          sendMessage({
            lineId: selectedLine,
            chatId: currentChat,
            message: { ...newMessage, status: 'delivered' }
          });
        } else {
          setMessageQueue(prev => ({
            ...prev,
            [messageId]: 'failed'
          }));

          setConversations(prev => prev.map(chat => {
            if (chat.id === currentChat) {
              return {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === messageId 
                    ? { ...msg, status: 'failed' }
                    : msg
                )
              };
            }
            return chat;
          }));
        }
      }, 1000);
    }, 500);
  }, [messageInput, currentChat, selectedLine, attachedFiles, sendMessage]);

  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex border-b border-[#B38B3F]/20 phone-system relative">
      <PhoneLinesList
        width={phoneLinesColumn.width}
        isResizing={phoneLinesColumn.isResizing}
        onResizeStart={phoneLinesColumn.handleMouseDown}
        onLineNameChange={handleLineNameChange}
        phoneLines={localPhoneLines}
        onSearch={() => setShowSearch(true)}
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
        selectedChats={selectedChats}
        setSelectedChats={setSelectedChats}
        selectedLine={selectedLine}
        currentChat={currentChat}
        conversations={draftChat ? [...conversations, draftChat] : conversations}
        onChatSelect={setCurrentChat}
        onNewMessage={handleStartNewMessage}
        chatStatuses={chatStatuses}
        onMakeCall={handleMakeCall}
        onDeleteChats={handleDeleteChats}
        onMarkRead={handleMarkRead}
        onMarkUnread={handleMarkUnread}
      />

      {/* Chat Area */}
      <div className="h-full flex-1 bg-zinc-900/50 flex flex-col relative z-0">
        {!selectedLine ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-center p-8 z-10">
            <div>
              <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select a Line</h3>
              <p className="text-white/60">Choose a phone line to start a draft message</p>
            </div>
          </div>
        ) : (
          <>
            {activePage === 'phone' && (
              <ChatArea
                selectedChat={conversations.find(c => c.id === currentChat) || null}
                messageInput={messageInput}
                onInputChange={setMessageInput}
                conversations={conversations}
                onSendMessage={handleSendMessage}
                isCreatingMessage={isCreatingMessage}
                setIsCreatingMessage={setIsCreatingMessage}
                newMessageNumber={newMessageNumber}
                onNewMessageChange={setNewMessageNumber}
                onStartChat={handleStartNewMessage}
                chatStatuses={chatStatuses}
                onStatusChange={handleStatusChange}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
                onMakeCall={handleMakeCall}
                onDeleteChats={handleDeleteChats}
                onRetry={handleRetry}
                onSchedule={handleScheduleMessage}
              />
            )}
            {activePage === 'call-logs' && (
              <CallLogs
                width={crmColumn.width}
                isResizing={crmColumn.isResizing}
                onResizeStart={crmColumn.handleMouseDown}
                onMakeCall={handleMakeCall}
              />
            )}
            {activePage === 'sms-campaign' && (
              <SMSAutomation />
            )}
          </>
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
      
      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          conversations={conversations}
          onChatSelect={(chatId) => {
            const chat = conversations.find(c => c.id === chatId);
            if (chat) {
              setSelectedLine(chat.lineId);
              setCurrentChat(chatId);
            }
          }}
        />
      )}
      
      {/* Phone Call Modal */}
      {showCallModal && callContact && (
        <PhoneCallModal
          onClose={() => {
            setShowCallModal(false);
            setCallContact(null);
          }}
          contactName={callContact.name}
          contactNumber={callContact.number}
        />
      )}
    </div>
  );
}