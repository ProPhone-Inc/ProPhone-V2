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
  const isConfigured = Boolean(googleClientId && 
    googleClientId && 
    googleClientId !== 'your-google-client-id' && 
    googleClientId !== '' && 
    googleClientId !== 'your-google-client-id-here' &&
    /^\d+(-[a-z0-9]+)?\.apps\.googleusercontent\.com$/.test(googleClientId)
  );

  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [connectedCalendars, setConnectedCalendars] = useState<Array<{id: string; name: string}>>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [events, setEvents] = useState<Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
    attendees?: Array<{email: string; responseStatus?: string}>;
    recurrence?: string[];
    status: string;
  }>>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
    flow: 'implicit',
    onNonOAuthError: (error) => {
      console.error('Google Calendar setup error:', error);
      if (!isConfigured) {
        setError('Google Calendar is not configured. Please add your Google Client ID to the environment variables.');
      } else {
        setError('Google Calendar is not properly configured');
      }
      setIsConnected(false);
    },
    onSuccess: async (response) => {
      if (!isConfigured) {
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
      // Get events from last 30 days to next 90 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const ninetyDaysAhead = new Date();
      ninetyDaysAhead.setDate(ninetyDaysAhead.getDate() + 90);

      const params = new URLSearchParams({
        timeMin: thirtyDaysAgo.toISOString(),
        timeMax: ninetyDaysAhead.toISOString(),
        maxResults: '2500',
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
      
      if (!data.items) {
        throw new Error('No events data received');
      }
      
      // Transform Google Calendar events to our format
      const transformedEvents = data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description,
        location: event.location,
        attendees: event.attendees?.map((attendee: any) => ({
          email: attendee.email,
          responseStatus: attendee.responseStatus
        })),
        recurrence: event.recurrence,
        status: event.status
      }));
      
      setEvents(transformedEvents);
      setLastSync(new Date());

    } catch (error) {
      console.error('Calendar sync failed:', error);
      setError('Failed to sync calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  const sync = useCallback(async () => {
    if (!isConfigured) {
      setError('Google Calendar is not configured. Please add your Google Client ID to the environment variables.');
      setIsConnected(false);
      return;
    }

    if (!accessToken) {
      setError('Not connected to Google Calendar');
      setIsConnected(false);
      return;
    }
    await handleSync(accessToken);
  }, [accessToken]);

  return {
    isConnected,
    isSyncing,
    isConfigured,
    events,
    lastSync,
    connectedEmail,
    connectedCalendars,
    selectedCalendar,
    connect: login,
    sync,
    selectCalendar: setSelectedCalendar,
    error
  };
}