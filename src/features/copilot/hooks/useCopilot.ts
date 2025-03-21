import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../../../api/client';

interface CopilotSettings {
  provider: 'openai' | 'anthropic' | 'google' | null;
  apiKey: string | null;
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    read?: boolean;
  }>;
  configurations: {
    id: string;
    name: string;
    provider: 'openai' | 'anthropic' | 'google';
    apiKey: string;
    isActive: boolean;
    lastUsed?: number;
  }[];
  lastUpdated?: number;
}

interface CopilotStore extends CopilotSettings {
  updateSettings: (settings: Partial<CopilotSettings>) => void;
  addConfiguration: (config: Omit<CopilotSettings['configurations'][0], 'id' | 'isActive'>) => void;
  updateConfiguration: (id: string, updates: Partial<Omit<CopilotSettings['configurations'][0], 'id'>>) => void;
  removeConfiguration: (id: string) => void;
  setActiveConfiguration: (id: string) => void;
  clearSettings: () => void;
  handleProviderSetup: (provider: string) => void;
}

export const useCopilot = create<CopilotStore>()(
  persist(
    (set, get) => ({
      provider: null,
      apiKey: null,
      messages: [],
      configurations: [],
      lastUpdated: null,

      updateSettings: async (settings) => {
        try {
          const { data } = await api.post('/copilot/settings', settings);
          set({
            ...data,
            lastUpdated: Date.now()
          });
        } catch (error) {
          console.error('Failed to update settings:', error);
          throw error;
        }
      },

      addConfiguration: async (config) => {
        const id = Math.random().toString(36).substr(2, 9);
        try {
          const { data } = await api.post('/copilot/configurations', {
            ...config,
            id,
            isActive: false
          });
        
          set((state) => ({
            configurations: [...state.configurations, data],
            ...(state.configurations.length === 0 ? {
              provider: data.provider,
              apiKey: data.apiKey
            } : {})
          }));
        } catch (error) {
          console.error('Failed to add configuration:', error);
          throw error;
        }
      },

      updateConfiguration: async (id, updates) => {
        try {
          const { data } = await api.put(`/copilot/configurations/${id}`, updates);
          set(state => ({
            configurations: state.configurations.map(config => 
              config.id === id ? data : config
            )
          }));
        } catch (error) {
          console.error('Failed to update configuration:', error);
          throw error;
        }
      },

      removeConfiguration: async (id) => {
        try {
          await api.delete(`/copilot/configurations/${id}`);
          set(state => ({
            configurations: state.configurations.filter(c => c.id !== id)
          }));
        } catch (error) {
          console.error('Failed to remove configuration:', error);
          throw error;
        }
      },

      setActiveConfiguration: async (id) => {
        try {
          const { data } = await api.post(`/copilot/configurations/${id}/activate`);
          set(state => ({
            configurations: state.configurations.map(c => ({
              ...c,
              isActive: c.id === id
            })),
            provider: data.provider,
            apiKey: data.apiKey
          }));
        } catch (error) {
          console.error('Failed to set active configuration:', error);
          throw error;
        }
      },

      clearSettings: async () => {
        try {
          await api.delete('/copilot/settings');
          set({
            provider: null,
            apiKey: null,
            configurations: [],
            lastUpdated: null
          });
        } catch (error) {
          console.error('Failed to clear settings:', error);
          throw error;
        }
      },

      handleProviderSetup: (provider: string) => {
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
            video: "https://www.youtube.com/embed/DEF456",
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
            video: "https://www.youtube.com/embed/GHI789",
            docs: "https://ai.google.dev/docs"
          }
        };

        const selectedInstructions = instructions[provider as keyof typeof instructions];
        if (!selectedInstructions) return;

        const message = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'assistant' as const,
          content: `Great choice! Let me help you set up ${selectedInstructions.title}:\n\n${selectedInstructions.steps.join('\n')}\n\nOnce you have your API key:\n1. Click the Settings icon in the top right corner\n2. Go to "CoPilot Settings"\n3. Click "Add New Configuration"\n4. Enter your API key\n\nNeed help with anything else?`,
          timestamp: new Date()
        };

        set(state => ({
          messages: [...state.messages, message]
        }));
      }
    }),
    {
      name: 'copilot-settings',
      partialize: (state) => ({
        messages: state.messages,
        lastUpdated: state.lastUpdated
      })
    }
  )
);