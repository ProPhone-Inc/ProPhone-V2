import { create } from 'zustand';

interface IncomingCall {
  name?: string;
  number: string;
  timestamp: Date;
}

interface IncomingCallState {
  incomingCall: IncomingCall | null;
  setIncomingCall: (call: IncomingCall | null) => void;
}

export const useIncomingCalls = create<IncomingCallState>((set) => ({
  incomingCall: null,
  setIncomingCall: (call) => set({ incomingCall: call })
}));