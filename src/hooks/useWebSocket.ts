import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const serverUrl = `${protocol}//${host}`;
    
    // Close existing connection if any
    if (socket?.connected) {
      socket.close();
    }

    socket = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket'],
      upgrade: false
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('message', (data) => {
      try {
        // Ensure received data is serializable
        const safeData = safeSerialize(data);
        if (safeData) {
          onMessage(safeData);
        }
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      // Attempt to reconnect on error
      setTimeout(connect, 5000);
    });
  }, [onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (!socket?.connected) {
      console.warn('WebSocket not connected, attempting to reconnect...');
      connect();
      return;
    }

    try {
      // Ensure outgoing data is serializable
      const safeData = safeSerialize(data);
      if (safeData) {
        socket.emit('message', safeData);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [connect]);

  return { sendMessage };
}