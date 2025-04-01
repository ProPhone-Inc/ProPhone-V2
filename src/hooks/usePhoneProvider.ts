import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPhoneProvider, PhoneProvider, ProviderConfig } from '../modules/phone/providers';

interface PhoneProviderStore {
  provider: PhoneProvider | null;
  config: ProviderConfig | null;
  isInitialized: boolean;
  error: string | null;
  initializeProvider: (type: string, config: ProviderConfig) => Promise<void>;
  sendSMS: (to: string, message: string) => Promise<any>;
  makeCall: (to: string, options?: any) => Promise<any>;
  getMessageStatus: (messageId: string) => Promise<any>;
  listPhoneNumbers: () => Promise<any[]>;
  purchasePhoneNumber: (areaCode: string) => Promise<any>;
  releasePhoneNumber: (phoneNumber: string) => Promise<void>;
}

export const usePhoneProvider = create<PhoneProviderStore>()(
  persist(
    (set, get) => ({
      provider: null,
      config: null,
      isInitialized: false,
      error: null,

      initializeProvider: async (type: string, config: ProviderConfig) => {
        try {
          const provider = createPhoneProvider(type, config);
          await provider.initialize(config);
          
          set({
            provider,
            config,
            isInitialized: true,
            error: null
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to initialize provider'
          });
          throw error;
        }
      },

      sendSMS: async (to: string, message: string) => {
        const { provider, isInitialized } = get();
        if (!provider || !isInitialized) {
          throw new Error('Phone provider not initialized');
        }
        return provider.sendSMS(to, message);
      },

      makeCall: async (to: string, options?: any) => {
        const { provider, isInitialized } = get();
        if (!provider || !isInitialized) {
          throw new Error('Phone provider not initialized');
        }
        return provider.makeCall(to, options);
      },

      getMessageStatus: async (messageId: string) => {
        const { provider, isInitialized } = get();
        if (!provider || !isInitialized) {
          throw new Error('Phone provider not initialized');
        }
        return provider.getMessageStatus(messageId);
      },

      listPhoneNumbers: async () => {
        const { provider, isInitialized } = get();
        if (!provider || !isInitialized) {
          throw new Error('Phone provider not initialized');
        }
        return provider.listPhoneNumbers();
      },

      purchasePhoneNumber: async (areaCode: string) => {
        const { provider, isInitialized } = get();
        if (!provider || !isInitialized) {
          throw new Error('Phone provider not initialized');
        }
        return provider.purchasePhoneNumber(areaCode);
      },

      releasePhoneNumber: async (phoneNumber: string) => {
        const { provider, isInitialized } = get();
        if (!provider || !isInitialized) {
          throw new Error('Phone provider not initialized');
        }
        return provider.releasePhoneNumber(phoneNumber);
      }
    }),
    {
      name: 'phone-provider-store',
      partialize: (state) => ({
        config: state.config
      })
    }
  )
);
