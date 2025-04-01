import React from 'react';
import { Calendar, Clock, Globe, Users, Bell, Check, X, Mail } from 'lucide-react';
import { useGoogleCalendar } from '../../../../hooks/useGoogleCalendar';

export function CalendarSection() {
  const { 
    isConnected, 
    connect, 
    sync, 
    isSyncing, 
    connectedEmail,
    connectedCalendars,
    selectedCalendar,
    selectCalendar,
    error,
    isConfigured 
  } = useGoogleCalendar();

  const [workingHours, setWorkingHours] = React.useState([
    { start: '09:00', end: '17:00' }
  ]);

  const [settings, setSettings] = React.useState({
    defaultView: 'month',
    showWeekends: true,
    showDeclinedEvents: false,
    defaultDuration: 30,
    notifications: {
      email: true,
      push: true,
      defaultReminder: 15
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const timezones = [
    { id: 'America/New_York', name: 'Eastern Time' },
    { id: 'America/Chicago', name: 'Central Time' },
    { id: 'America/Denver', name: 'Mountain Time' },
    { id: 'America/Los_Angeles', name: 'Pacific Time' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <Calendar className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Calendar Settings</h2>
            <p className="text-white/60">Manage your calendar preferences</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Google Calendar Integration */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Google Calendar</h3>
                <p className="text-sm text-white/60">Sync your Google Calendar</p>
              </div>
            </div>
            <button
              onClick={isConnected ? sync : connect}
              disabled={!isConfigured}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                isConnected 
                  ? 'bg-[#B38B3F]/20 text-[#FFD700] hover:bg-[#B38B3F]/30'
                  : 'bg-white hover:bg-gray-50 text-gray-600 shadow-md hover:shadow-lg border border-gray-200'
              }`}
            >
              {isConnected ? (
                <>
                  <Calendar className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </>
              ) : (
                <>
                  <span>Connect Calendar</span>
                </>
              )}
            </button>
          </div>

          {isConnected && (
            <div className="space-y-4">
              <div className="flex items-center text-white/60 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mr-2" />
                Connected as {connectedEmail}
              </div>
              
              {connectedCalendars.length > 0 && (
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Default Calendar
                  </label>
                  <select
                    value={selectedCalendar || ''}
                    onChange={(e) => selectCalendar(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  >
                    {connectedCalendars.map(cal => (
                      <option key={cal.id} value={cal.id}>{cal.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Working Hours */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Clock className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Working Hours</h3>
              <p className="text-sm text-white/60">Set your default working hours</p>
            </div>
          </div>

          <div className="space-y-4">
            {workingHours.map((hours, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-white/70 text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => {
                      const newHours = [...workingHours];
                      newHours[index].start = e.target.value;
                      setWorkingHours(newHours);
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-white/70 text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => {
                      const newHours = [...workingHours];
                      newHours[index].end = e.target.value;
                      setWorkingHours(newHours);
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Preferences */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Globe className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Calendar Preferences</h3>
              <p className="text-sm text-white/60">Customize your calendar view</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Default View</label>
              <select
                value={settings.defaultView}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultView: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
                <option value="schedule">Schedule</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              >
                {timezones.map(tz => (
                  <option key={tz.id} value={tz.id}>{tz.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-white">Show Weekends</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showWeekends}
                    onChange={(e) => setSettings(prev => ({ ...prev, showWeekends: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white">Show Declined Events</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showDeclinedEvents}
                    onChange={(e) => setSettings(prev => ({ ...prev, showDeclinedEvents: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Bell className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Notifications</h3>
              <p className="text-sm text-white/60">Configure event reminders</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Default Reminder</label>
              <select
                value={settings.notifications.defaultReminder}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  notifications: { 
                    ...prev.notifications, 
                    defaultReminder: parseInt(e.target.value) 
                  }
                }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              >
                <option value="0">At time of event</option>
                <option value="5">5 minutes before</option>
                <option value="10">10 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-white/60" />
                  <span className="text-white">Email Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { 
                        ...prev.notifications, 
                        email: e.target.checked 
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-white/60" />
                  <span className="text-white">Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { 
                        ...prev.notifications, 
                        push: e.target.checked 
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}