import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptData, decryptData } from '../utils/encryption';

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
  getDecryptedKey: () => string | null;
}

export const useCopilot = create<CopilotStore>()(
  persist(
    (set, get) => ({
      provider: null,
      apiKey: null,
      messages: [],
      configurations: [],
      lastUpdated: null,

      updateSettings: (settings) => {
        // If updating API key, encrypt it first
        const updates: Partial<CopilotSettings> = {
          ...settings,
          lastUpdated: Date.now()
        };

        if (settings.apiKey) {
          updates.apiKey = encryptData(settings.apiKey);
        }

        set((state) => ({
          ...state,
          ...updates
        }));
      },

      addConfiguration: (config) => {
        const id = Math.random().toString(36).substr(2, 9);
        const encryptedKey = encryptData(config.apiKey);
        
        set((state) => ({
          configurations: [
            ...state.configurations,
            {
              ...config,
              id,
              apiKey: encryptedKey,
              isActive: state.configurations.length === 0 // Make active if first config
            }
          ],
          // If this is the first config, also set it as the main provider/key
          ...(state.configurations.length === 0 ? {
            provider: config.provider,
            apiKey: encryptedKey
          } : {})
        }));
      },

      updateConfiguration: (id, updates) => {
        set((state) => ({
          configurations: state.configurations.map(config => 
            config.id === id 
              ? { 
                  ...config, 
                  ...updates,
                  // If updating API key, encrypt it
                  ...(updates.apiKey ? { apiKey: encryptData(updates.apiKey) } : {})
                }
              : config
          )
        }));
      },

      removeConfiguration: (id) => {
        set((state) => {
          const newConfigs = state.configurations.filter(c => c.id !== id);
          const wasActive = state.configurations.find(c => c.id === id)?.isActive;
          
          // If removing active config, make the most recently used one active
          if (wasActive && newConfigs.length > 0) {
            const nextActive = [...newConfigs].sort((a, b) => 
              (b.lastUsed || 0) - (a.lastUsed || 0)
            )[0];
            nextActive.isActive = true;
            
            return {
              configurations: newConfigs,
              provider: nextActive.provider,
              apiKey: nextActive.apiKey
            };
          }
          
          return { configurations: newConfigs };
        });
      },

      setActiveConfiguration: (id) => {
        set((state) => {
          const config = state.configurations.find(c => c.id === id);
          if (!config) return state;

          return {
            configurations: state.configurations.map(c => ({
              ...c,
              isActive: c.id === id,
              ...(c.id === id ? { lastUsed: Date.now() } : {})
            })),
            provider: config.provider, // Keep for backward compatibility
            apiKey: config.apiKey,
          };
        });
      },

      clearSettings: () => set({
        provider: null,
        apiKey: null,
        configurations: [],
        lastUpdated: null
      }),
      
      getDecryptedKey: () => {
        const state = get();
        if (!state.apiKey) return null;
        try {
          return decryptData(state.apiKey);
        } catch (error) {
          console.error('Failed to decrypt API key:', error);
          return null;
        }
      }
    }),
    {
      name: 'copilot-settings',
      // Only persist these fields
      partialize: (state) => ({
        provider: state.provider,
        apiKey: state.apiKey,
        messages: state.messages,
        configurations: state.configurations,
        lastUpdated: state.lastUpdated
      })
    }
  )
);