import { create } from 'zustand';

interface Plan {
  id: string;
  name: string;
  price: string;
  users: number;
  revenue: string;
  stripeId?: string;
  features: string[];
}

interface PlansStore {
  plans: Plan[];
  updatePlan: (planId: string, updates: Partial<Plan>) => void;
  syncWithStripe: () => Promise<void>;
  updatePlanFeatures: (planId: string, features: string[]) => Promise<void>;
}

export const usePlans = create<PlansStore>((set, get) => ({
  plans: [
    {
      id: 'starter',
      name: 'Business Starter',
      price: 'Free',
      users: 125,
      revenue: '$0',
      features: [
        'Basic Marketing Tools',
        'Up to 100 Contacts',
        'Email Support',
        'Basic Analytics',
        'Standard Templates'
      ]
    },
    {
      id: 'pro',
      name: 'Business Pro',
      price: '$29',
      users: 450,
      revenue: '$13,050',
      features: [
        'Advanced Marketing Tools',
        'Up to 2500 Contacts',
        'Priority Support',
        'Advanced Analytics',
        'Premium Templates',
        'Custom Branding',
        'API Access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Business Elite',
      price: '$99',
      users: 225,
      revenue: '$22,275',
      features: [
        'Enterprise Marketing Suite',
        'Unlimited Contacts',
        '24/7 Dedicated Support',
        'Custom Analytics',
        'Custom Templates',
        'White Labeling',
        'API Access',
        'Custom Integrations',
        'Dedicated Account Manager'
      ]
    }
  ],
  
  updatePlan: (planId, updates) => {
    set(state => ({
      plans: state.plans.map(plan =>
        plan.id === planId ? { ...plan, ...updates } : plan
      )
    }));
  },

  updatePlanFeatures: async (planId: string, features: string[]) => {
    try {
      // First update in Stripe
      await get().syncWithStripe();
      
      // Then update local state
      set(state => ({
        plans: state.plans.map(plan =>
          plan.id === planId ? { ...plan, features } : plan
        )
      }));
      
      // Sync back with Stripe to ensure consistency
      await get().syncWithStripe();
      
      return;
    } catch (error) {
      console.error('Failed to update plan features:', error);
      throw error;
    }
  },

  syncWithStripe: async () => {
    try {
      // In a real app, fetch latest prices from Stripe
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, we'll simulate syncing with Stripe
      console.log('Syncing plans with Stripe...');
      
      // In a real app, this would:
      // 1. Update Stripe product metadata with features
      // 2. Update prices if changed
      // 3. Update product descriptions
      // 4. Sync any other product details
      
      return;
    } catch (error) {
      console.error('Failed to sync with Stripe:', error);
    }
  }
}));