import { useState, useEffect } from 'react';
import { db, ensureConnection } from '../db';
import { useAuth } from './useAuth';

export function useDB() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await ensureConnection();
        setIsConnected(true);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const getUserData = async () => {
    if (!user?.email) return null;
    return await db.getUserByEmail(user.email);
  };

  const getCampaigns = async () => {
    if (!user?.id) return [];
    return await db.getCampaignsByUser(user.id);
  };

  const getContacts = async () => {
    if (!user?.id) return [];
    return await db.getContactsByUser(user.id);
  };

  const getChatHistory = async (limit?: number) => {
    if (!user?.id) return [];
    return await db.getChatHistory(user.id, limit);
  };

  const getUnreadChats = async () => {
    if (!user?.id) return 0;
    return await db.getUnreadSessionCount(user.id);
  };

  const getAutomations = async () => {
    if (!user?.id) return [];
    return await db.getActiveAutomations(user.id);
  };

  const getAnalytics = async (type: string) => {
    if (!user?.id) return [];
    return await db.getAnalyticsByType(user.id, type);
  };

  const getTeamMembers = async () => {
    // For now, return from the users table
    // In a real app, this would filter by team ID or organization
    const users = await db.users.toArray();
    return users.map(user => ({
      id: user.id || '',
      name: user.name,
      email: user.email,
      role: user.role
    }));
  };

  return {
    db,
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