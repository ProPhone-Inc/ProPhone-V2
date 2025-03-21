import { useState, useEffect, useRef } from 'react';
import { Message } from '../types';

export function useUnreadMessages(messages: Message[]) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const lastMessageId = useRef<string | null>(null);
  const readMessageIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].type === 'assistant') {
      const lastMessage = messages[messages.length - 1];
      
      if (!readMessageIds.current.has(lastMessage.id)) {
        setUnreadCount(prev => prev + 1);
        setHasUnreadMessage(true);
        lastMessageId.current = lastMessage.id;
      }
    }
  }, [messages]);

  const markAsRead = () => {
    messages.forEach(message => {
      if (message.type === 'assistant') {
        readMessageIds.current.add(message.id);
      }
    });
    setUnreadCount(0);
    setHasUnreadMessage(false);
  };

  return {
    unreadCount,
    hasUnreadMessage,
    markAsRead
  };
}