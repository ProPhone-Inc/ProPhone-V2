import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CallLog {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed' | 'denied';
  lineId: string;
  number: string;
  name?: string;
  duration?: string;
  timestamp: string;
  status: 'completed' | 'missed' | 'denied';
}

interface CallLogsStore {
  logs: CallLog[];
  addLog: (log: Omit<CallLog, 'id' | 'timestamp'>) => void;
  updateLog: (id: string, updates: Partial<CallLog>) => void;
  deleteLogs: (ids: string[]) => void;
  clearLogs: () => void;
}

export const useCallLogs = create<CallLogsStore>()(
  persist(
    (set) => ({
      logs: [],
      
      addLog: (log) => set((state) => ({
        logs: [{
          ...log,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        }, ...state.logs]
      })),
      
      updateLog: (id, updates) => set((state) => ({
        logs: state.logs.map(log => 
          log.id === id ? { ...log, ...updates } : log
        )
      })),
      
      deleteLogs: (ids) => set((state) => ({
        logs: state.logs.filter(log => !ids.includes(log.id))
      })),
      
      clearLogs: () => set({ logs: [] })
    }),
    {
      name: 'call-logs'
    }
  )
);