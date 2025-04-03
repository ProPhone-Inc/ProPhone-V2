import React from 'react';
import { Clock, Calendar, Globe, Users, Bell, Link2, Mail } from 'lucide-react';

export function CalendarSection() {
  const [schedule, setSchedule] = React.useState({
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timezone: 'America/New_York',
    startTime: '09:00',
    endTime: '17:00', 
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  // Get current time in selected timezone
  const getCurrentTime = React.useCallback((tz: string) => {
    try {
      return new Date().toLocaleTimeString('en-US', { 
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting timezone:', error);
      return '';
    }
  }, []);

  const timezones = [
    { id: 'America/New_York', name: 'Eastern Time' },
    { id: 'America/Chicago', name: 'Central Time' },
    { id: 'America/Denver', name: 'Mountain Time' },
    { id: 'America/Los_Angeles', name: 'Pacific Time' }
  ];

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

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
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (schedule.daysOfWeek.includes(day)) {
                      setSchedule({
                        ...schedule,
                        daysOfWeek: schedule.daysOfWeek.filter(d => d !== day)
                      });
                    } else {
                      setSchedule({
                        ...schedule,
                        daysOfWeek: [...schedule.daysOfWeek, day]
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    schedule.daysOfWeek.includes(day)
                      ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                      : 'bg-zinc-800 text-white/70 hover:text-white border border-[#B38B3F]/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Start Time</label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                />
              </div>
            </div>
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
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      showWeekends: e.target.checked 
                    }))}
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
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      showDeclinedEvents: e.target.checked 
                    }))}
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