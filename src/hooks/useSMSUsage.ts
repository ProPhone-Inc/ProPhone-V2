import { create } from 'zustand';
import { useAuth } from './useAuth';

interface SMSUsageStore {
  used: number;
  limit: number | null; // null means unlimited
  lastReset: string | null; // ISO date string of last reset
  updateUsage: (used: number) => void;
  incrementUsage: () => void;
  getLimit: () => number | null;
  resetUsage: () => void;
  checkAndResetUsage: () => void;
}

export const useSMSUsage = create<SMSUsageStore>((set, get) => ({
  used: 0,
  limit: null, // Default to unlimited
  lastReset: null,
  

  updateUsage: (used) => set({ used }),
  
  incrementUsage: async () => {
    const { user } = useAuth.getState();
    try {
      const response = await fetch('/api/sms/usage/increment', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to increment SMS usage');
      }
      
      const { used } = await response.json();
      set({ used });
    } catch (error) {
      console.error('Failed to increment SMS usage:', error);
      throw error;
    }
  },

  getLimit: () => {
    const { user } = useAuth.getState();
    // Return 5000 limit only for free plan users who aren't sub users
    if (user?.plan === 'starter' && user?.role !== 'sub_user') {
      return 5000;
    }
    // All other users (paid plans and sub users) get unlimited
    return null;
  },

  resetUsage: async () => {
    try {
      const response = await fetch('/api/sms/usage/reset', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset SMS usage');
      }
      
      const { lastReset } = await response.json();
      set({ used: 0, lastReset });
    } catch (error) {
      console.error('Failed to reset SMS usage:', error);
      throw error;
    }
  },

  checkAndResetUsage: async () => {
    const { user } = useAuth.getState();
    const { lastReset } = get();
    
    // Skip if not a free plan user or is a sub user
    if (!user || user.plan !== 'starter' || user.role === 'sub_user') return;

    // Get user's billing cycle start date (e.g., 1st of each month)
    const billingStartDay = 1; // Can be configured per user in a real app
    
    const now = new Date();
    const lastResetDate = lastReset ? new Date(lastReset) : null;
    
    // Check if we're in a new billing cycle
    if (!lastResetDate || (
      now.getMonth() !== lastResetDate.getMonth() &&
      now.getDate() >= billingStartDay
    )) {
      await get().resetUsage();
    }
  }
}));