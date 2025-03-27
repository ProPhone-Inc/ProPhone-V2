import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailProvider, EmailMessage, GmailProvider } from '../services/email/EmailProvider';

interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  connected: boolean;
}

interface EmailStore {
  accounts: EmailAccount[];
  selectedAccount: EmailAccount | null;
  currentFolder: string;
  messages: EmailMessage[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  provider: EmailProvider | null;
  
  // Actions
  connectAccount: (email: string, password: string, provider: string) => Promise<void>;
  disconnectAccount: (accountId: string) => Promise<void>;
  selectAccount: (accountId: string) => void;
  loadMessages: (folder?: string, page?: number) => Promise<void>;
  sendMessage: (to: string[], subject: string, body: string, attachments?: File[]) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markAsUnread: (messageId: string) => Promise<void>;
  toggleStar: (messageId: string) => Promise<void>;
  moveToTrash: (messageId: string) => Promise<void>;
  addLabel: (messageId: string, label: string) => Promise<void>;
  removeLabel: (messageId: string, label: string) => Promise<void>;
}

export const useEmail = create<EmailStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      selectedAccount: null,
      currentFolder: 'inbox',
      messages: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
      provider: null,

      connectAccount: async (email, password, provider) => {
        set({ isLoading: true, error: null });
        
        try {
          let emailProvider: EmailProvider;
          
          switch (provider.toLowerCase()) {
            case 'gmail':
              emailProvider = new GmailProvider(
                email,
                import.meta.env.VITE_GOOGLE_CLIENT_ID,
                import.meta.env.VITE_GOOGLE_CLIENT_SECRET
              );
              break;
            // Add other providers here
            default:
              throw new Error('Unsupported email provider');
          }

          await emailProvider.connect();

          const newAccount = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            provider,
            connected: true
          };

          set(state => ({
            accounts: [...state.accounts, newAccount],
            selectedAccount: newAccount,
            provider: emailProvider
          }));

          // Load initial messages
          await get().loadMessages();

        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to connect account' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      disconnectAccount: async (accountId) => {
        const { accounts, provider, selectedAccount } = get();
        
        try {
          if (provider) {
            await provider.disconnect();
          }

          set({
            accounts: accounts.filter(a => a.id !== accountId),
            selectedAccount: selectedAccount?.id === accountId ? null : selectedAccount,
            provider: selectedAccount?.id === accountId ? null : provider
          });

        } catch (error) {
          set({ error: 'Failed to disconnect account' });
          throw error;
        }
      },

      selectAccount: (accountId) => {
        const account = get().accounts.find(a => a.id === accountId);
        if (account) {
          set({ selectedAccount: account });
          get().loadMessages();
        }
      },

      loadMessages: async (folder = 'inbox', page = 1) => {
        const { provider } = get();
        if (!provider) return;

        set({ isLoading: true, error: null });
        
        try {
          const messages = await provider.getMessages(folder, page);
          set({ 
            messages,
            currentFolder: folder,
            currentPage: page
          });
        } catch (error) {
          set({ error: 'Failed to load messages' });
        } finally {
          set({ isLoading: false });
        }
      },

      sendMessage: async (to, subject, body, attachments) => {
        const { provider } = get();
        if (!provider) throw new Error('No email provider connected');

        set({ isLoading: true, error: null });
        
        try {
          await provider.sendMessage(to, subject, body, attachments);
        } catch (error) {
          set({ error: 'Failed to send message' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      markAsRead: async (messageId) => {
        const { provider } = get();
        if (!provider) return;

        try {
          await provider.markAsRead(messageId);
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId ? { ...msg, read: true } : msg
            )
          }));
        } catch (error) {
          set({ error: 'Failed to mark message as read' });
        }
      },

      markAsUnread: async (messageId) => {
        const { provider } = get();
        if (!provider) return;

        try {
          await provider.markAsUnread(messageId);
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId ? { ...msg, read: false } : msg
            )
          }));
        } catch (error) {
          set({ error: 'Failed to mark message as unread' });
        }
      },

      toggleStar: async (messageId) => {
        const { provider } = get();
        if (!provider) return;

        try {
          await provider.toggleStar(messageId);
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
            )
          }));
        } catch (error) {
          set({ error: 'Failed to toggle star' });
        }
      },

      moveToTrash: async (messageId) => {
        const { provider } = get();
        if (!provider) return;

        try {
          await provider.moveToTrash(messageId);
          set(state => ({
            messages: state.messages.filter(msg => msg.id !== messageId)
          }));
        } catch (error) {
          set({ error: 'Failed to move message to trash' });
        }
      },

      addLabel: async (messageId, label) => {
        const { provider } = get();
        if (!provider) return;

        try {
          await provider.addLabel(messageId, label);
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId ? { ...msg, labels: [...msg.labels, label] } : msg
            )
          }));
        } catch (error) {
          set({ error: 'Failed to add label' });
        }
      },

      removeLabel: async (messageId, label) => {
        const { provider } = get();
        if (!provider) return;

        try {
          await provider.removeLabel(messageId, label);
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId ? { 
                ...msg, 
                labels: msg.labels.filter(l => l !== label)
              } : msg
            )
          }));
        } catch (error) {
          set({ error: 'Failed to remove label' });
        }
      }
    }),
    {
      name: 'email-store',
      partialize: (state) => ({
        accounts: state.accounts,
        selectedAccount: state.selectedAccount
      })
    }
  )
);