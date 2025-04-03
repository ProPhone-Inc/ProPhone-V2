import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface AnalyticsData {
  smsGrowth: number;
  callsGrowth: number;
  messagesGrowth: number;
  missedCallsGrowth: number;
  isLoading: boolean;
  error: string | null;
}

export function useAnalytics(): AnalyticsData {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    smsGrowth: 0,
    callsGrowth: 0,
    messagesGrowth: 0,
    missedCallsGrowth: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        // In a real app, this would be an API call to get actual analytics data
        // For now, we'll simulate fetching data with random values
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate random growth rates between -10% and +15%
        const getRandomGrowth = () => {
          return parseFloat((Math.random() * 25 - 10).toFixed(1));
        };
        
        setData({
          smsGrowth: getRandomGrowth(),
          callsGrowth: getRandomGrowth(),
          messagesGrowth: getRandomGrowth(),
          missedCallsGrowth: getRandomGrowth(),
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load analytics data'
        }));
      }
    };
    
    fetchAnalytics();
    
    // Set up polling to update analytics data every 5 minutes
    const intervalId = setInterval(fetchAnalytics, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  return data;
}