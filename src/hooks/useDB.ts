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
    const { data } = await api.get('/team/members');
    return data;
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
    getAnalytics,
    getTeamMembers
  };
}