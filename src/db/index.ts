import Dexie, { Table } from 'dexie';

// Define interfaces for database tables
export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'owner' | 'super_admin' | 'executive' | 'manager' | 'member';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  plan: 'starter' | 'pro' | 'enterprise' | 'god_mode';
  joinDate: string;
  lastLogin: string;
  avatar?: string;
  permissions: string[];
  metadata?: Record<string, any>;
}

export interface Campaign {
  id?: string;
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
  id?: string;
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
  id?: string;
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

export interface ChatSession {
  id?: string;
  userId: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface Document {
  id?: string;
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
  id?: string;
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
  id?: string;
  userId: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface CopilotConfig {
  id?: string;
  provider: 'openai' | 'anthropic' | 'google';
  apiKey: string;
  name: string;
  isActive: boolean;
  lastUsed?: string;
}

class ProPhoneDB extends Dexie {
  users!: Table<User>;
  campaigns!: Table<Campaign>;
  contacts!: Table<Contact>;
  chatMessages!: Table<ChatMessage>;
  chatSessions!: Table<ChatSession>;
  documents!: Table<Document>;
  automations!: Table<Automation>;
  analytics!: Table<Analytics>;
  copilotConfig!: Table<CopilotConfig>;

  constructor() {
    super('ProPhoneDB');
    
    this.version(1).stores({
      users: '++id, email, role, status, plan',
      campaigns: '++id, userId, status, type, createdAt',
      contacts: '++id, userId, email, status, tags, createdAt',
      chatMessages: '++id, userId, type, timestamp',
      chatSessions: '++id, userId, timestamp, unread',
      documents: '++id, userId, type, status, createdAt',
      automations: '++id, userId, status, createdAt',
      analytics: '++id, userId, type, timestamp',
      copilotConfig: '++id, provider, apiKey, name, isActive, lastUsed'
    });
  }

  // Helper methods for common operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.where('email').equals(email).first();
  }

  async getCampaignsByUser(userId: string): Promise<Campaign[]> {
    return this.campaigns.where('userId').equals(userId).toArray();
  }

  async getContactsByUser(userId: string): Promise<Contact[]> {
    return this.contacts.where('userId').equals(userId).toArray();
  }

  async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    return this.chatMessages
      .where('userId')
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  async getUnreadSessionCount(userId: string): Promise<number> {
    return this.chatSessions
      .where('userId')
      .equals(userId)
      .and(session => session.unread)
      .count();
  }

  async getActiveAutomations(userId: string): Promise<Automation[]> {
    return this.automations
      .where('userId')
      .equals(userId)
      .and(automation => automation.status === 'active')
      .toArray();
  }

  async getAnalyticsByType(userId: string, type: string): Promise<Analytics[]> {
    return this.analytics
      .where('userId')
      .equals(userId)
      .and(analytics => analytics.type === type)
      .toArray();
  }

  // Copilot configuration methods
  async getCopilotConfigs(): Promise<CopilotConfig[]> {
    return this.copilotConfig.toArray();
  }

  async getActiveConfig(): Promise<CopilotConfig | undefined> {
    return this.copilotConfig.where('isActive').equals(true).first();
  }

  async addCopilotConfig(config: Omit<CopilotConfig, 'id'>): Promise<string> {
    return this.copilotConfig.add(config);
  }

  async updateCopilotConfig(id: string, updates: Partial<CopilotConfig>): Promise<void> {
    await this.copilotConfig.update(id, updates);
  }

  async removeCopilotConfig(id: string): Promise<void> {
    await this.copilotConfig.delete(id);
  }

  async setActiveConfig(id: string): Promise<void> {
    await this.transaction('rw', this.copilotConfig, async () => {
      // Deactivate all configs
      await this.copilotConfig.where('isActive').equals(true).modify({ isActive: false });
      // Activate the selected config
      await this.copilotConfig.update(id, { 
        isActive: true,
        lastUsed: new Date().toISOString()
      });
    });
  }
}

export const db = new ProPhoneDB();

// Track database state
let isInitialized = false;
let isOpen = false;

// Initialize with default owner account if not exists
db.on('ready', async () => {
  if (isInitialized) return;
  isInitialized = true;
  isOpen = true;
  
  const ownerExists = await db.users.where('role').equals('owner').first();
  
  if (!ownerExists) {
    await db.users.add({
      email: 'dallas@prophone.io',
      name: 'Dallas Reynolds',
      role: 'owner',
      status: 'active',
      plan: 'god_mode',
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png',
      permissions: ['*']
    });
  }
});

// Handle database open/close
db.on('close', () => {
  isOpen = false;
});

export const ensureConnection = async () => {
  if (!isOpen) {
    await db.open();
    isOpen = true;
  }
};