import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SystemNotification {
  id: string;
  type: 'billing' | 'maintenance' | 'announcement' | 'security';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    url: string;
  };
}

interface SystemNotificationsStore {
  notifications: SystemNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useSystemNotifications = create<SystemNotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const newNotification: SystemNotification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          read: false
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },
      
      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: state.notifications.find(n => n.id === id)?.read 
            ? state.unreadCount 
            : Math.max(0, state.unreadCount - 1)
        }));
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      }
    }),
    {
      name: 'system-notifications'
    }
  )
);