import { useState, useEffect, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  onClick?: () => void;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    window.Notification?.permission || 'default'
  );

  // Request permission on mount if needed
  useEffect(() => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return;
    }

    if (permission === 'default') {
      Notification.requestPermission().then(perm => setPermission(perm));
    }
  }, [permission]);

  const sendNotification = useCallback(({ title, body, icon, tag, onClick }: NotificationOptions) => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return;
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '/vite.svg', // Default to Vite logo
        tag,
        silent: false // Enable sound
      });

      if (onClick) {
        notification.onclick = () => {
          window.focus();
          notification.close();
          onClick();
        };
      }

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [permission]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied' as NotificationPermission;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  return {
    permission,
    sendNotification,
    requestPermission
  };
}