import { create } from 'zustand';

interface PhoneLine {
  id: string;
  name: string;
  number: string;
  inUseBy?: string; // Campaign ID using this line
}

interface CampaignPhoneLinesStore {
  phoneLines: PhoneLine[];
  campaignRotation: Record<string, {
    currentLineIndex: number;
    currentMessageIndex: number;
    lastSendTime: number;
  }>;
  getAvailableLines: () => PhoneLine[];
  getInUseLines: () => PhoneLine[];
  assignLinesToCampaign: (campaignId: string, lineIds: string[]) => void;
  releaseLines: (campaignId: string) => void;
  isLineAvailable: (lineId: string) => boolean;
  getNextLineAndMessage: (campaignId: string, totalMessages: number) => {
    lineId: string;
    messageIndex: number;
  } | null;
}

export const useCampaignPhoneLines = create<CampaignPhoneLinesStore>((set, get) => ({
  phoneLines: [
    { id: '1', name: 'Sales Line 1', number: '(555) 123-4567' },
    { id: '2', name: 'Sales Line 2', number: '(555) 234-5678' },
    { id: '3', name: 'Support Line', number: '(555) 345-6789' }
  ],
  campaignRotation: {},

  getAvailableLines: () => {
    return get().phoneLines.filter(line => !line.inUseBy);
  },

  getInUseLines: () => {
    return get().phoneLines.filter(line => line.inUseBy);
  },

  assignLinesToCampaign: (campaignId: string, lineIds: string[]) => {
    set(state => ({
      phoneLines: state.phoneLines.map(line => 
        lineIds.includes(line.id) ? { ...line, inUseBy: campaignId } : line
      ),
      campaignRotation: {
        ...state.campaignRotation,
        [campaignId]: {
          currentLineIndex: 0,
          currentMessageIndex: 0,
          lastSendTime: 0
        }
      }
    }));
  },

  releaseLines: (campaignId: string) => {
    set(state => {
      const newRotation = { ...state.campaignRotation };
      delete newRotation[campaignId];
      
      return {
        phoneLines: state.phoneLines.map(line => 
          line.inUseBy === campaignId ? { ...line, inUseBy: undefined } : line
        ),
        campaignRotation: newRotation
      };
    });
  },

  isLineAvailable: (lineId: string) => {
    const line = get().phoneLines.find(l => l.id === lineId);
    return line ? !line.inUseBy : false;
  },

  getNextLineAndMessage: (campaignId: string, totalMessages: number) => {
    const state = get();
    const rotation = state.campaignRotation[campaignId];
    if (!rotation) return null;

    const campaignLines = state.phoneLines.filter(line => line.inUseBy === campaignId);
    if (campaignLines.length === 0) return null;

    // Get current time
    const now = Date.now();
    const timeSinceLastSend = now - rotation.lastSendTime;
    
    // Check if we need to wait for the next minute
    if (timeSinceLastSend < 60000) {
      return null;
    }

    // Get next line and message indices
    const nextLineIndex = (rotation.currentLineIndex + 1) % campaignLines.length;
    const nextMessageIndex = (rotation.currentMessageIndex + 1) % totalMessages;

    // Update rotation state
    set(state => ({
      campaignRotation: {
        ...state.campaignRotation,
        [campaignId]: {
          currentLineIndex: nextLineIndex,
          currentMessageIndex: nextMessageIndex,
          lastSendTime: now
        }
      }
    }));

    return {
      lineId: campaignLines[nextLineIndex].id,
      messageIndex: nextMessageIndex
    };
  },
}));