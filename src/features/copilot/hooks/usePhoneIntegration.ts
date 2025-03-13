import { useState, useCallback } from 'react';
import { handlePhoneAction } from '../utils/phoneActions';
import { Chat } from '../types';

interface UsePhoneIntegrationProps {
  chats: Chat[];
  onStatusUpdate?: (chatId: string, status: string) => void;
  onNewMessage?: (number: string, content: string) => void;
  onMakeCall?: (number: string) => void;
}

export function usePhoneIntegration({
  chats,
  onStatusUpdate,
  onNewMessage,
  onMakeCall
}: UsePhoneIntegrationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastActionResult, setLastActionResult] = useState<string | null>(null);

  const executeAction = useCallback(async (actionType: string, parameters: Record<string, string>) => {
    setIsProcessing(true);
    try {
      const result = await handlePhoneAction({ type: actionType as any, parameters }, chats);
      
      // Handle side effects based on action type
      switch (actionType) {
        case 'CREATE_MESSAGE':
          onNewMessage?.(parameters.number, parameters.content);
          break;
        case 'MAKE_CALL':
          onMakeCall?.(parameters.number);
          break;
        case 'UPDATE_STATUS':
          onStatusUpdate?.(parameters.chatId, parameters.status);
          break;
      }

      setLastActionResult(result);
      return result;
    } catch (error) {
      console.error('Failed to execute phone action:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [chats, onNewMessage, onMakeCall, onStatusUpdate]);

  return {
    executeAction,
    isProcessing,
    lastActionResult
  };
}