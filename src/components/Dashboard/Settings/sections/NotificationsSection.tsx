import React from 'react';
import { Bell, Mail, Phone, Globe } from 'lucide-react';

export function NotificationsSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Mail className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Email Notifications</h3>
              <p className="text-sm text-white/60">Manage your email alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'marketing', label: 'Marketing Updates', description: 'Receive news about new features and promotions' },
              { id: 'security', label: 'Security Alerts', description: 'Get notified about important security updates' },
              { id: 'activity', label: 'Account Activity', description: 'Notifications about your account activity' },
              { id: 'newsletter', label: 'Newsletter', description: 'Weekly digest of platform updates' }
            ].map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{setting.label}</div>
                  <div className="text-sm text-white/60">{setting.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Bell className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Push Notifications</h3>
              <p className="text-sm text-white/60">Control your browser notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'messages', label: 'New Messages', description: 'Get notified when you receive new messages' },
              { id: 'mentions', label: 'Mentions', description: 'Notify when someone mentions you' },
              { id: 'updates', label: 'Platform Updates', description: 'Important updates about the platform' }
            ].map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{setting.label}</div>
                  <div className="text-sm text-white/60">{setting.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Phone className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">SMS Notifications</h3>
              <p className="text-sm text-white/60">Manage text message alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'sms_security', label: 'Security Codes', description: 'Receive 2FA codes via SMS' },
              { id: 'sms_reminders', label: 'Reminders', description: 'Get important reminders via text' }
            ].map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{setting.label}</div>
                  <div className="text-sm text-white/60">{setting.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}