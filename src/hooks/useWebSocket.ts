import { useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';

let socket: WebSocket | null = null;
const notificationSound = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/AUDIO-2024-03-11-13-13-03.mp3');
notificationSound.preload = 'auto';

// Helper function to safely serialize data
function safeSerialize(data: any): any {
  try {
    // Remove any non-serializable values
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    }));
  } catch (error) {
    console.error('Failed to serialize data:', error);
    return null;
  }
}

export function useWebSocket(onMessage: (message: any) => void) {
  const connect = useCallback(() => {
    // Create real WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const serverUrl = `${protocol}//${host}`;
    
    if (socket?.readyState === WebSocket.OPEN) {
      socket.close(); 
    }

    socket = new WebSocket(serverUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect
      setTimeout(connect, 5000);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const safeData = safeSerialize(data);
        if (safeData) {
          // Play notification sound for new messages
          notificationSound.play().catch(() => {
            console.log('Audio playback was prevented');
          });
          onMessage(safeData);
        }
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    };
  }, [onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, attempting to reconnect...');
      connect();
      return;
    }

    try {
      // Ensure outgoing data is serializable
      const safeData = safeSerialize(data);
      if (safeData) {
        socket.send(JSON.stringify(safeData));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [connect]);

  return { sendMessage };
}