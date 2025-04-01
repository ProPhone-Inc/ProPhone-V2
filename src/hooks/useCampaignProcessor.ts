import { create } from 'zustand';
import { useSystemNotifications } from './useSystemNotifications';
import { useDNCManager } from './useDNCManager';

interface CampaignProcessingState {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  lists: {
    campaign: string[];
    dnc: string[];
    [key: string]: string[]; // For other status lists
  };
  counts: {
    campaign: number;
    dnc: number;
    [key: string]: number;
  };
}

interface CampaignProcessorStore {
  processingStates: Record<string, CampaignProcessingState>;
  startProcessing: (campaignId: string, audience: any[], selectedStatuses: string[]) => Promise<void>;
  getProcessingState: (campaignId: string) => CampaignProcessingState | null;
  clearProcessingState: (campaignId: string) => void;
}

export const useCampaignProcessor = create<CampaignProcessorStore>((set, get) => ({
  processingStates: {},

  startProcessing: async (campaignId, audience, selectedStatuses) => {
    const { addNotification } = useSystemNotifications.getState();
    const { isBlocked } = useDNCManager.getState();

    // Initialize processing state
    set(state => ({
      processingStates: {
        ...state.processingStates,
        [campaignId]: {
          id: campaignId,
          status: 'processing',
          progress: 0,
          lists: {
            campaign: [],
            dnc: [],
            ...selectedStatuses.reduce((acc, status) => ({ ...acc, [status]: [] }), {})
          },
          counts: {
            campaign: 0,
            dnc: 0,
            ...selectedStatuses.reduce((acc, status) => ({ ...acc, [status]: 0 }), {})
          }
        }
      }
    }));

    try {
      // Process audience in batches
      const batchSize = 100;
      const totalContacts = audience.length;
      let processedCount = 0;

      for (let i = 0; i < audience.length; i += batchSize) {
        const batch = audience.slice(i, i + batchSize);
        
        // Process each contact in the batch
        for (const contact of batch) {
          // Check all phone number fields
          const phoneFields = ['phone1', 'phone2', 'phone3', 'phone4', 'phone5'];
          const validPhones = phoneFields
            .map(field => contact[field])
            .filter(phone => phone && typeof phone === 'string')
            .map(phone => {
              // Clean and format phone number
              const cleaned = phone.replace(/\D/g, '');
              if (cleaned.length === 10) {
                return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
              }
              return null;
            })
            .filter(phone => phone !== null) as string[];

          // Process each valid phone number
          for (const phone of validPhones) {
            // First check DNC
            if (isBlocked(phone)) {
              get().processingStates[campaignId].lists.dnc.push(phone);
              get().processingStates[campaignId].counts.dnc++;
              continue;
            }

            // Check against other statuses
            let matched = false;
            for (const status of selectedStatuses) {
              if (contact.status === status) {
                get().processingStates[campaignId].lists[status].push(phone);
                get().processingStates[campaignId].counts[status]++;
                matched = true;
                break;
              }
            }

            // If no status match, add to campaign list
            if (!matched) {
              get().processingStates[campaignId].lists.campaign.push(phone);
              get().processingStates[campaignId].counts.campaign++;
            }
          }

          processedCount++;
          
          // Update progress
          const progress = Math.round((processedCount / totalContacts) * 100);
          set(state => ({
            processingStates: {
              ...state.processingStates,
              [campaignId]: {
                ...state.processingStates[campaignId],
                progress
              }
            }
          }));
        }

        // Small delay between batches to prevent UI blocking
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Mark as completed
      set(state => ({
        processingStates: {
          ...state.processingStates,
          [campaignId]: {
            ...state.processingStates[campaignId],
            status: 'completed',
            progress: 100
          }
        }
      }));

      // Send completion notification
      addNotification({
        type: 'announcement',
        title: 'Campaign Processing Complete',
        message: `Campaign list created with ${get().processingStates[campaignId].counts.campaign} numbers`,
        priority: 'medium'
      });

    } catch (error) {
      console.error('Campaign processing error:', error);
      
      // Mark as failed
      set(state => ({
        processingStates: {
          ...state.processingStates,
          [campaignId]: {
            ...state.processingStates[campaignId],
            status: 'failed'
          }
        }
      }));

      // Send error notification
      addNotification({
        type: 'announcement',
        title: 'Campaign Processing Failed',
        message: error instanceof Error ? error.message : 'Failed to process campaign',
        priority: 'high'
      });
    }
  },

  getProcessingState: (campaignId) => {
    return get().processingStates[campaignId] || null;
  },

  clearProcessingState: (campaignId) => {
    set(state => {
      const { [campaignId]: _, ...rest } = state.processingStates;
      return { processingStates: rest };
    });
  }
}));