import React from 'react';
import { Webhook, Phone, Plus, AlertTriangle, Check, Network } from 'lucide-react';

export function IntegrationsSection() {
  const [phoneProviders] = React.useState([
    {
      id: 'att',
      name: 'AT&T',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/att.png',
      status: 'active',
      lines: ['(555) 123-4567', '(555) 234-5678']
    },
    {
      id: 'verizon',
      name: 'Verizon',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/verizon.png',
      status: 'active',
      lines: ['(555) 345-6789']
    },
    {
      id: 'tmobile',
      name: 'T-Mobile',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/tmobile.png',
      status: 'inactive',
      lines: []
    }
  ]);

  const [webhooks] = React.useState([
    {
      id: 'stripe',
      name: 'Stripe Payments',
      endpoint: 'https://api.prophone.io/webhooks/stripe',
      events: ['payment.succeeded', 'subscription.updated'],
      status: 'active'
    },
    {
      id: 'calls',
      name: 'Call Events',
      endpoint: 'https://api.prophone.io/webhooks/calls',
      events: ['call.started', 'call.ended', 'voicemail.new'],
      status: 'active'
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Integrations</h2>
      </div>

      <div className="space-y-6">
        {/* Phone Providers */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-medium text-white">Phone Providers</h3>
                <p className="text-sm text-white/60">Manage your phone line providers</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Provider</span>
            </button>
          </div>

          <div className="space-y-4">
            {phoneProviders.map(provider => (
              <div key={provider.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center p-2">
                    <img src={provider.logo} alt={provider.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{provider.name}</div>
                    <div className="text-sm text-white/60">
                      {provider.lines.length} active {provider.lines.length === 1 ? 'line' : 'lines'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {provider.status === 'active' ? (
                    <span className="flex items-center text-emerald-400 text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center text-white/40 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Inactive
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

        {/* Webhooks */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                <Webhook className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-medium text-white">Webhooks</h3>
                <p className="text-sm text-white/60">Manage webhook endpoints</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Webhook</span>
            </button>
          </div>

          <div className="space-y-4">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="p-4 bg-zinc-900/50 rounded-lg border border-[#B38B3F]/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-white">{webhook.name}</div>
                    <div className="text-sm font-mono text-white/60 mt-1">{webhook.endpoint}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center text-emerald-400 text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      Active
                    </span>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {webhook.events.map((event, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}