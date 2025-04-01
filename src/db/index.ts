// This file now exports MongoDB models and types
export * from '../server/models/User';

// Export common types
export interface Campaign {
  id: string;
  userId: string;
  name: string;
  type: 'email' | 'sms' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  content: string;
  schedule?: {
    startDate: string;
    endDate?: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  metrics: {
    views: number;
    clicks: number;
    conversions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: string[];
  source: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  lastContact?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  userId: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    actions?: Array<{
      type: string;
      target: string;
      label: string;
    }>;
  };
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  content: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface Automation {
  id: string;
  userId: string;
  name: string;
  trigger: {
    type: string;
    conditions: Record<string, any>[];
  };
  actions: Array<{
    type: string;
    params: Record<string, any>;
  }>;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  id: string;
  userId: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
}