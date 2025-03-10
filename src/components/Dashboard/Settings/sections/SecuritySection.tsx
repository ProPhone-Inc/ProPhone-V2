import React from 'react';
import { Shield, Key, Smartphone, Lock } from 'lucide-react';

export function SecuritySection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Security Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Smartphone className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-white/60">Add an extra layer of security</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'authenticator', label: 'Authenticator App', description: 'Use an authenticator app like Google Authenticator' },
              { id: 'sms', label: 'SMS Authentication', description: 'Receive codes via text message' },
              { id: 'email', label: 'Email Authentication', description: 'Get codes sent to your email' }
            ].map(method => (
              <div key={method.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{method.label}</div>
                  <div className="text-sm text-white/60">{method.description}</div>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Setup
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Password Settings */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Key className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Password Settings</h3>
              <p className="text-sm text-white/60">Manage your password security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
              <div>
                <div className="font-medium text-white">Change Password</div>
                <div className="text-sm text-white/60">Last changed 3 months ago</div>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                Update
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
              <div>
                <div className="font-medium text-white">Password Requirements</div>
                <div className="text-sm text-white/60">Set minimum password strength</div>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Security Log */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Shield className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Security Log</h3>
              <p className="text-sm text-white/60">Recent security events</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { event: 'Login from new device', location: 'Nashville, TN', time: '2 hours ago', status: 'success' },
              { event: 'Password changed', location: 'Nashville, TN', time: '3 months ago', status: 'success' },
              { event: 'Failed login attempt', location: 'Unknown', time: '1 week ago', status: 'warning' }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{log.event}</div>
                  <div className="text-sm text-white/60">{log.location} • {log.time}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.status === 'success' 
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {log.status === 'success' ? 'Success' : 'Warning'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}