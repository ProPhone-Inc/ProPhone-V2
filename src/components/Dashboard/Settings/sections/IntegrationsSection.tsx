import React from 'react';
import { Globe, Plus, Check, AlertTriangle } from 'lucide-react';

export function IntegrationsSection() {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [integrations] = React.useState([
    {
      id: 'google',
      name: 'Google Workspace',
      icon: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      status: 'connected',
      lastSync: '2 hours ago'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
      status: 'connected',
      lastSync: '1 hour ago'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: 'https://st1.zoom.us/zoom.ico',
      status: 'error',
      lastSync: '1 day ago'
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Integrations</h2>
          <p className="text-white/60 mt-1">Connect your favorite tools and services</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-medium">
          Beta
        </span>
      </div>

      <div className="space-y-6">
        {/* Connected Services */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                <Globe className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-medium text-white">Connected Services</h3>
                <p className="text-sm text-white/60">Manage your integrated services</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-4">
            {integrations.map(integration => (
              <div key={integration.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center p-2">
                    <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{integration.name}</div>
                    <div className="text-sm text-white/60">Last synced: {integration.lastSync}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {integration.status === 'connected' ? (
                    <span className="flex items-center text-emerald-400 text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-400 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Connection Error
                    </span>
                  )}
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Integrations */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <h3 className="font-medium text-white mb-4">Available Integrations</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Microsoft 365', description: 'Calendar and email integration' },
              { name: 'Zapier', description: 'Automate your workflows' },
              { name: 'HubSpot', description: 'CRM integration' },
              { name: 'Stripe', description: 'Payment processing' }
            ].map(integration => (
              <div key={integration.name} className="p-4 bg-zinc-900/50 rounded-lg border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 transition-colors">
                <h4 className="font-medium text-white">{integration.name}</h4>
                <p className="text-sm text-white/60 mt-1">{integration.description}</p>
                <button className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm w-full">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Access */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <h3 className="font-medium text-white mb-4">API Access</h3>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">API Key</div>
                <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                  Generate New Key
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                />
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Copy
                </button>
              </div>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">Webhook URL</div>
                <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                  Configure
                </button>
              </div>
              <input
                type="text"
                value="https://api.example.com/webhook"
                readOnly
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}