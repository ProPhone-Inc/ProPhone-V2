import { create } from 'zustand';

interface IncomingCall {
  name?: string;
  number: string;
  isIncoming: boolean;
  timestamp: Date;
}

interface IncomingCallState {
  incomingCall: IncomingCall | null;
  setIncomingCall: (call: IncomingCall | null) => void;
  clearIncomingCall: () => void;
}

export const useIncomingCalls = create<IncomingCallState>((set) => ({
  incomingCall: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  clearIncomingCall: () => set({ incomingCall: null })
}));