export interface PhoneLine {
  id: string;
  name: string;
  number: string;
  unread: number;
  chats: Array<{
    id: string;
    unread: number;
  }>;
}

export interface Chat {
  id: string;
  lineId: string;
  name: string;
  avatar: string;
  messages: Array<{
    id: string;
    content: string;
    time: string;
    type: 'sent' | 'received';
  }>;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
  email?: string;
  notes?: string;
  segments?: string[];
}

export interface Message {
  id: string;
  content: string;
  time: string;
  type: 'sent' | 'received';
}

export interface PhoneSystemProps {
  selectedMessage: string | null;
  selectedChat: string | null;
  onMessageSelect?: (messageId: string | null) => void;
}