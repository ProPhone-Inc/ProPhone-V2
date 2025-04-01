import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotifications } from './useNotifications';

// Initialize notification sound
const notificationSound = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/notification-sound-for-messenger-messages.mp3');
notificationSound.preload = 'auto';

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

interface NotificationToast {
  id: string;
  notification: SystemNotification;
  timeoutId: NodeJS.Timeout;
}

interface SystemNotificationsStore {
  notifications: SystemNotification[];
  activeToasts: NotificationToast[];
  unreadCount: number;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  removeToast: (id: string) => void;
}

export const useSystemNotifications = create<SystemNotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      activeToasts: [],
      unreadCount: 0,

      addNotification: (notification) => {
        // Request notification permission if needed
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }

        const newNotification: SystemNotification = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          read: false,
          ...notification
        };

        // Send desktop notification if permission granted
        if (Notification.permission === 'granted') {
          const desktopNotification = new Notification(notification.title, {
            body: notification.message,
            icon: '/vite.svg',
            tag: notification.type,
            silent: false
          });

          // Handle notification click
          desktopNotification.onclick = () => {
            window.focus();
            if (notification.action?.url) {
              window.location.href = notification.action.url;
            }
            desktopNotification.close();
            // Mark as read when clicked
            get().markAsRead(newNotification.id);
          };

          // Auto close after 5 seconds
          setTimeout(() => desktopNotification.close(), 5000);
        }
        
        // Play notification sound
        notificationSound.play().catch(() => {
          console.log('Audio playback was prevented');
        });
        
        // Create toast element
        const toastElement = document.createElement('div');
        toastElement.className = 'fixed top-4 right-4 w-96 bg-zinc-900/95 border border-[#B38B3F]/30 rounded-xl shadow-2xl transform animate-fade-in z-[1000] backdrop-blur-sm cursor-pointer';
        toastElement.id = `toast-${newNotification.id}`;
        
        // Add toast content
        toastElement.innerHTML = `
          <div class="p-4 flex items-start space-x-3">
            <div class="w-8 h-8 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center flex-shrink-0">
              ${getIconSVG(notification.type)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-white">${notification.title}</div>
              <p class="text-sm text-white/70 mt-1">${notification.message}</p>
              ${notification.action ? `
                <button class="mt-2 text-[#FFD700] text-sm hover:text-[#FFD700]/80 transition-colors">
                  ${notification.action.label}
                </button>
              ` : ''}
            </div>
          </div>
        `;
        
        // Add click handler
        toastElement.addEventListener('click', () => {
          if (notification.action?.url) {
            window.location.href = notification.action.url;
          }
          get().markAsRead(newNotification.id);
          get().removeToast(newNotification.id);
        });
        
        // Add to document
        document.body.appendChild(toastElement);
        
        // Set timeout to remove toast
        const timeoutId = setTimeout(() => {
          get().removeToast(newNotification.id);
        }, 5000);
        
        // Add to store
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
          activeToasts: [...state.activeToasts, { 
            id: newNotification.id,
            notification: newNotification,
            timeoutId
          }]
        }));
      },
      
      removeToast: (id: string) => {
        // Remove toast element
        const toastElement = document.getElementById(`toast-${id}`);
        if (toastElement) {
          // Add fade out animation
          toastElement.style.animation = 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
          
          // Remove element after animation
          toastElement.addEventListener('animationend', () => {
            toastElement.remove();
          }, { once: true });
        }
        
        // Clear timeout and remove from store
        set(state => {
          const toast = state.activeToasts.find(t => t.id === id);
          if (toast) {
            clearTimeout(toast.timeoutId);
          }
          return {
            activeToasts: state.activeToasts.filter(t => t.id !== id)
          };
        });
      },
      
      markAllAsRead: () => {
        // First mark all notifications as read in the store
        set(state => {
          // Create a new array with all notifications marked as read
          const updatedNotifications = state.notifications.map(n => ({
            ...n,
            read: true
          }));
          
          return {
            notifications: updatedNotifications,
            unreadCount: 0
          };
        });
      },
      
      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
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

// Helper function to get icon SVG
function getIconSVG(type: SystemNotification['type']) {
  switch (type) {
    case 'billing':
      return '<svg class="w-5 h-5 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="7" x2="22" y2="7"/></svg>';
    case 'maintenance':
      return '<svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    case 'security':
      return '<svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s8 3 8 10v1c0 4.4-3.6 8-8 8s-8-3.6-8-8v-1C4 5 12 2 12 2"/></svg>';
    default:
      return '<svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }
}