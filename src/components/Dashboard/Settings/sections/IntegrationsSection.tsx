import React from 'react';
import { Phone, Plus, AlertTriangle, Check, Network } from 'lucide-react';
import { usePhoneProvider } from '../../../../hooks/usePhoneProvider';

export function IntegrationsSection() {
  const { provider, initializeProvider } = usePhoneProvider();
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = React.useState(false);
  const [providerStatus, setProviderStatus] = React.useState<Record<string, boolean>>({});
  const [error, setError] = React.useState<string | null>(null);

  const phoneProviders = [
    {
      id: 'twilio',
      name: 'Twilio',
      logo: 'https://www.twilio.com/assets/icons/twilio-icon.svg',
      description: 'Global communications platform for SMS, voice, and video'
    },
    {
      id: 'telnyx',
      name: 'Telnyx',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/10522416.png',
      description: 'Enterprise-grade communications platform'
    },
    {
      id: 'bandwidth',
      name: 'Bandwidth',
      logo: 'https://www.bandwidth.com/wp-content/themes/bandwidth/favicon/favicon-32x32.png',
      description: 'Communications APIs and network platform'
    }
  ];

  // Check provider status on mount
  React.useEffect(() => {
    const checkProviderStatus = async () => {
      const status: Record<string, boolean> = {};
      for (const p of phoneProviders) {
        try {
          const isActive = await provider?.isInitialized(p.id);
          status[p.id] = isActive || false;
        } catch {
          status[p.id] = false;
        }
      }
      setProviderStatus(status);
    };
    
    checkProviderStatus();
  }, [provider]);

  const handleProviderSelect = async (providerId: string) => {
    setSelectedProvider(providerId);
    setIsConfiguring(true);
    setError(null);

    try {
      // In a real app, this would prompt for API keys and configuration
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        accountSid: 'test-account-sid'
      };

      await initializeProvider(providerId, config);
      
      // Show success state briefly
      setTimeout(() => {
        setIsConfiguring(false);
        setSelectedProvider(null);
      }, 1500);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to configure provider');
      setIsConfiguring(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <Network className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Integrations</h2>
            <p className="text-white/60">Connect and manage your external services</p>
          </div>
        </div>
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
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <img src={provider.logo} alt={provider.name} className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{provider.name}</div>
                    <div className="text-sm text-white/60">{provider.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {providerStatus[provider.id] ? (
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
                  <button 
                    onClick={() => handleProviderSelect(provider.id)}
                    disabled={isConfiguring && selectedProvider === provider.id}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isConfiguring && selectedProvider === provider.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Configuring...</span>
                      </div>
                    ) : (
                      'Configure'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}