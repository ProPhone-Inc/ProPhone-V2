import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from './useAuth';

export function useDB() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const getUserData = async () => {
    if (!user?.email) return null;
    const { data } = await api.get('/user/profile');
    return data;
  };

  const getCampaigns = async () => {
    if (!user?.id) return [];
    const { data } = await api.get('/campaigns');
    return data;
  };

  const getContacts = async () => {
    if (!user?.id) return [];
    const { data } = await api.get('/contacts');
    return data;
  };

  const getChatHistory = async (limit?: number) => {
    if (!user?.id) return [];
    const { data } = await api.get(`/chat/history${limit ? `?limit=${limit}` : ''}`);
    return data;
  };

  const getUnreadChats = async () => {
    if (!user?.id) return 0;
    const { data } = await api.get('/chat/unread/count');
    return data.count;
  };

  const getUnreadMessages = async () => {
    if (!user?.id) return 0;
    try {
      // Get unread count from all phone lines
      const phoneLines = [
        { id: '1', unread: 10 },
        { id: '2', unread: 0 },
        { id: '3', unread: 0 },
        { id: '4', unread: 0 },
        { id: '5', unread: 0 }
      ];
      
      // Sum up all unread messages
      const totalUnread = phoneLines.reduce((sum, line) => sum + (line.unread || 0), 0);
      return totalUnread;
    } catch (error) {
      console.error('Failed to get unread messages count:', error);
      return 0;
    }
  };

  const getAutomations = async () => {
    if (!user?.id) return [];
    const { data } = await api.get('/automations/active');
    return data;
  };

  const getAnalytics = async (type: string) => {
    if (!user?.id) return [];
    const { data } = await api.get(`/analytics/${type}`);
    return data;
  };

  const getTeamMembers = async () => {
    try {
      // Return mock data with owner as only admin
      return [
        {
          id: '1',
          name: 'Dallas Reynolds',
          email: 'dallas@prophone.io',
          role: 'owner',
          permissions: ['phone', 'crm', 'docupro', 'proflow']
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@example.com',
          role: 'member',
          permissions: ['phone', 'crm', 'docupro', 'proflow']
        },
        {
          id: '3',
          name: 'Emma Wilson',
          email: 'emma@example.com',
          role: 'member',
          permissions: ['phone', 'crm', 'docupro', 'proflow']
        }
      ];
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      return [];
    }
  };

  return {
    isLoading,
    error,
    getUserData,
    getCampaigns,
    getContacts,
    getChatHistory,
    getUnreadChats,
    getAutomations,
    getUnreadMessages,
    getAnalytics,
    getTeamMembers
  };
}