import { create } from 'zustand';
import { useSystemNotifications } from './useSystemNotifications';

interface CampaignSettings {
  schedule: {
    daysOfWeek: string[];
    timezone: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate?: string;
  };
  smsRate: number;
  status: 'scheduled' | 'active' | 'paused' | 'completed';
}

interface CampaignSettingsStore {
  settings: Record<string, CampaignSettings>;
  updateSettings: (campaignId: string, updates: Partial<CampaignSettings>) => void;
  pauseCampaign: (campaignId: string) => void;
  resumeCampaign: (campaignId: string) => void;
  getSettings: (campaignId: string) => CampaignSettings | null;
}

export const useCampaignSettings = create<CampaignSettingsStore>((set, get) => ({
  settings: {},

  updateSettings: (campaignId, updates) => {
    const { addNotification } = useSystemNotifications.getState();
    const currentSettings = get().settings[campaignId];

    if (!currentSettings) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    // Validate updates
    if (updates.schedule) {
      // Ensure start time is before end time
      if (updates.schedule.startTime && updates.schedule.endTime) {
        const start = new Date(`1970-01-01T${updates.schedule.startTime}`);
        const end = new Date(`1970-01-01T${updates.schedule.endTime}`);
        if (end <= start) {
          addNotification({
            type: 'announcement',
            title: 'Invalid Time Range',
            message: 'End time must be after start time',
            priority: 'high'
          });
          return;
        }
      }

      // Ensure start date is not in the past
      if (updates.schedule.startDate) {
        const start = new Date(updates.schedule.startDate);
        if (start < new Date()) {
          addNotification({
            type: 'announcement',
            title: 'Invalid Start Date',
            message: 'Start date cannot be in the past',
            priority: 'high'
          });
          return;
        }
      }

      // Ensure at least one day is selected
      if (updates.schedule.daysOfWeek && updates.schedule.daysOfWeek.length === 0) {
        addNotification({
          type: 'announcement',
          title: 'Invalid Days Selection',
          message: 'Select at least one day of the week',
          priority: 'high'
        });
        return;
      }
    }

    // Update settings
    set(state => ({
      settings: {
        ...state.settings,
        [campaignId]: {
          ...state.settings[campaignId],
          ...updates,
          schedule: updates.schedule ? {
            ...state.settings[campaignId].schedule,
            ...updates.schedule
          } : state.settings[campaignId].schedule
        }
      }
    }));

    // Send notification
    addNotification({
      type: 'announcement',
      title: 'Campaign Updated',
      message: 'Campaign settings have been updated successfully',
      priority: 'low'
    });
  },

  pauseCampaign: (campaignId) => {
    const { addNotification } = useSystemNotifications.getState();
    
    set(state => ({
      settings: {
        ...state.settings,
        [campaignId]: {
          ...state.settings[campaignId],
          status: 'paused'
        }
      }
    }));

    addNotification({
      type: 'announcement',
      title: 'Campaign Paused',
      message: 'Campaign has been paused and can be resumed later',
      priority: 'medium'
    });
  },

  resumeCampaign: (campaignId) => {
    const { addNotification } = useSystemNotifications.getState();
    const settings = get().settings[campaignId];

    if (!settings) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    // Check if campaign can be resumed
    const now = new Date();
    const startDate = new Date(settings.schedule.startDate);
    if (startDate > now) {
      set(state => ({
        settings: {
          ...state.settings,
          [campaignId]: {
            ...state.settings[campaignId],
            status: 'scheduled'
          }
        }
      }));
    } else {
      set(state => ({
        settings: {
          ...state.settings,
          [campaignId]: {
            ...state.settings[campaignId],
            status: 'active'
          }
        }
      }));
    }

    addNotification({
      type: 'announcement',
      title: 'Campaign Resumed',
      message: 'Campaign has been resumed and will continue sending messages',
      priority: 'medium'
    });
  },

  getSettings: (campaignId) => {
    return get().settings[campaignId] || null;
  }
}));