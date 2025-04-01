export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: string;
    parameters: Record<string, string>;
  }>;
  context?: {
    type: 'phone' | 'crm' | 'automation';
    data?: any;
  };
}

export interface Action {
  type: string;
  parameters: Record<string, string>;
  confirmationMessage?: string;
}

export interface SavedChat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export interface CopilotConfig {
  provider: 'openai' | 'anthropic' | 'google';
  apiKey: string;
  systemPrompt: string;
}