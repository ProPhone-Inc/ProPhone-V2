import { useState, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isSyncing: boolean;
  connectedEmail: string | null;
  connectedCalendars: Array<{id: string; name: string}>;
  selectedCalendar: string | null;
  connect: () => void;
  sync: () => Promise<void>;
  selectCalendar: (calendarId: string) => void;
  error: string | null;
}

export function useGoogleCalendar(): UseGoogleCalendarReturn {
  // Check if Google client ID is configured
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = Boolean(googleClientId && googleClientId !== 'your-google-client-id-here');

  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [connectedCalendars, setConnectedCalendars] = useState<Array<{id: string; name: string}>>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
    flow: 'implicit',
    onSuccess: async (response) => {
      if (!isGoogleConfigured) {
        setError('Google Calendar is not configured. Please add your Google Client ID to the environment variables.');
        return;
      }

      setAccessToken(response.access_token);
      setIsConnected(true);
      setError(null);
      
      // Get user email and calendar list
      await getUserInfo(response.access_token);
      await getCalendarList(response.access_token);
      
      // Perform initial sync after connection
      await handleSync(response.access_token);
    },
    onError: (error) => {
      console.error('Google Calendar login failed:', error);
      setError('Failed to connect to Google Calendar');
      setIsConnected(false);
    }
  });
  const getUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setConnectedEmail(data.email);
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  };

  const getCalendarList = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      const calendars = data.items?.map((cal: any) => ({
        id: cal.id,
        name: cal.summary
      })) || [];

      setConnectedCalendars(calendars);
      
      // Set primary calendar as default
      const primaryCal = calendars.find(cal => cal.id === 'primary');
      if (primaryCal) {
        setSelectedCalendar(primaryCal.id);
      }
    } catch (error) {
      console.error('Failed to get calendar list:', error);
    }
  };

  const handleSync = async (token: string) => {
    setIsSyncing(true);
    setError(null);
    
    try {
      // Get events from Google Calendar
      const params = new URLSearchParams({
        timeMin: new Date().toISOString(),
        maxResults: '100',
        singleEvents: 'true',
        orderBy: 'startTime'
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar || 'primary'}/events?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();
      const events = data.items;

      // Store events in local state/database
      // This would integrate with your app's calendar storage
      console.log('Synced events:', events);

      // Dispatch success notification
      // You can integrate this with your notification system
      console.log('Calendar sync successful');

    } catch (error) {
      console.error('Calendar sync failed:', error);
      setError('Failed to sync calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  const sync = useCallback(async () => {
    if (!isGoogleConfigured) {
      setError('Google Calendar is not configured. Please add your Google Client ID to the environment variables.');
      return;
    }

    if (!accessToken) {
      setError('Not connected to Google Calendar');
      return;
    }
    await handleSync(accessToken);
  }, [accessToken]);

  return {
    isConnected,
    isSyncing,
    isConfigured: isGoogleConfigured,
    connectedEmail,
    connectedCalendars,
    selectedCalendar,
    connect: login,
    sync,
    selectCalendar: setSelectedCalendar,
    error
  };
}