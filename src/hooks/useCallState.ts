import { create } from 'zustand';

interface CallState {
  activeCall: { name?: string; number: string } | null;
  setActiveCall: (call: { name?: string; number: string } | null) => void;
}

export const useCallState = create<CallState>((set) => ({
  activeCall: null,
  setActiveCall: (call) => set({ activeCall: call })
}));