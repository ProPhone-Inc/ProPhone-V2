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
  number?: string | null;
  isGroup?: boolean;
  avatar: string;
  messages: Array<{
    id: string;
    content: string;
    time: string;
    type: 'sent' | 'received';
    status?: 'sent' | 'delivered' | 'failed';
  }>;
  lastMessage: string;
  time: string;
  unread: number;
  messageStatus?: {
    label: string;
    icon: React.ReactNode;
  };
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