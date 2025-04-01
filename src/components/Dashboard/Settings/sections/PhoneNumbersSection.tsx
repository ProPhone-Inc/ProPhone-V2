import React from 'react';
import { Phone, Plus, Search, Filter, ChevronDown, Check, AlertTriangle, DollarSign, MessageSquare, Image, X, MapPin, Building2 } from 'lucide-react';
import { usePhoneProvider } from '../../../../hooks/usePhoneProvider';

interface Market {
  id: string;
  name: string;
  description: string;
  numbers: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export function PhoneNumbersSection() {
  const { provider, listPhoneNumbers, purchasePhoneNumber, releasePhoneNumber } = usePhoneProvider();
  const [activeTab, setActiveTab] = React.useState<'numbers' | 'markets'>('numbers');
  const [phoneNumbers, setPhoneNumbers] = React.useState<Array<{
    number: string;
    formattedNumber: string;
    capabilities: {
      voice: boolean;
      sms: boolean;
      mms: boolean;
    };
    monthlyPrice: number;
    status: string;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [areaCode, setAreaCode] = React.useState('');
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = React.useState({
    voice: true,
    sms: true,
    mms: false
  });
  const [markets, setMarkets] = React.useState<Market[]>([
    {
      id: '1',
      name: 'Downtown Area',
      description: 'Main business district coverage',
      numbers: ['(555) 123-4567', '(555) 234-5678'],
      status: 'active',
      createdAt: '2025-03-15'
    },
    {
      id: '2',
      name: 'Suburban Region',
      description: 'Residential area coverage',
      numbers: ['(555) 345-6789'],
      status: 'active',
      createdAt: '2025-03-14'
    }
  ]);
  const [showCreateMarket, setShowCreateMarket] = React.useState(false);
  const [showApiDocs, setShowApiDocs] = React.useState(false);
  const [newMarket, setNewMarket] = React.useState({
    name: '',
    description: '',
    numbers: [] as string[]
  });

  // Load phone numbers on mount
  React.useEffect(() => {
    const loadPhoneNumbers = async () => {
      if (!provider) {
        setError('No phone provider configured');
        setIsLoading(false);
        return;
      }

      try {
        const numbers = await listPhoneNumbers();
        setPhoneNumbers(numbers);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load phone numbers');
      } finally {
        setIsLoading(false);
      }
    };

    loadPhoneNumbers();
  }, [provider, listPhoneNumbers]);

  const handlePurchaseNumber = async () => {
    if (!areaCode || areaCode.length !== 3) {
      setError('Please enter a valid 3-digit area code');
      return;
    }

    setIsPurchasing(true);
    setError(null);

    try {
      const newNumber = await purchasePhoneNumber(areaCode);
      setPhoneNumbers(prev => [...prev, newNumber]);
      setShowPurchaseModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to purchase number');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleReleaseNumber = async (number: string) => {
    try {
      await releasePhoneNumber(number);
      setPhoneNumbers(prev => prev.filter(n => n.number !== number));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to release number');
    }
  };

  if (!provider) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <div>
          <h4 className="text-amber-400 font-medium">No Phone Provider Configured</h4>
          <p className="text-amber-400/80 text-sm mt-1">
            Please configure a phone provider in the Integrations section to manage phone numbers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <Phone className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Phone Numbers</h2>
            <p className="text-white/60">Manage your phone numbers</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowApiDocs(true)}
            className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
          >
            <Code className="w-4 h-4" />
            <span>API Docs</span>
          </button>
          {activeTab === 'numbers' ? (
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Purchase Number</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCreateMarket(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Market</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-[#B38B3F]/20">
        <button
          onClick={() => setActiveTab('numbers')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'numbers'
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Numbers</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('markets')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'markets'
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Markets</span>
          </div>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'numbers' && (
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search phone numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/40" />
            <select
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Numbers</option>
              <option value="voice">Voice Only</option>
              <option value="sms">SMS Only</option>
              <option value="both">Voice & SMS</option>
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      ) : phoneNumbers.length === 0 ? (
        <div className="text-center py-12">
          <Phone className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No phone numbers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {phoneNumbers.map((number) => (
            <div
              key={number.number}
              className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{number.formattedNumber}</div>
                    <div className="flex items-center space-x-3 mt-1">
                      {number.capabilities.voice && (
                        <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                          Voice
                        </span>
                      )}
                      {number.capabilities.sms && (
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                          SMS
                        </span>
                      )}
                      {number.capabilities.mms && (
                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                          MMS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-[#FFD700] font-medium flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {number.monthlyPrice.toFixed(2)}
                    </div>
                    <div className="text-white/60 text-sm">per month</div>
                  </div>
                  <button
                    onClick={() => handleReleaseNumber(number.number)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Release
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'markets' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              <select
                className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {markets.map((market) => (
              <div
                key={market.id}
                className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{market.name}</div>
                      <div className="text-white/60 text-sm mt-1">{market.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-[#FFD700] font-medium">
                        {market.numbers.length} Numbers
                      </div>
                      <div className="text-white/60 text-sm">
                        Created {new Date(market.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      market.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {market.numbers.map((number) => (
                    <div key={number} className="bg-zinc-900/50 rounded-lg p-3 border border-[#B38B3F]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-[#FFD700]" />
                          <span className="text-white">{number}</span>
                        </div>
                        <button className="text-white/40 hover:text-white/60">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Number Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPurchaseModal(false)} />
          <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
            <div className="p-6">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                  <Phone className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Purchase Number</h3>
                  <p className="text-white/60">Add a new phone number to your account</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Area Code
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    pattern="\d{3}"
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                    placeholder="Enter 3-digit area code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Capabilities
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-white/60" />
                        <span className="text-white">Voice Calls</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.voice}
                        onChange={(e) => setSelectedCapabilities(prev => ({
                          ...prev,
                          voice: e.target.checked
                        }))}
                        className="rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-4 h-4 text-white/60" />
                        <span className="text-white">SMS</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.sms}
                        onChange={(e) => setSelectedCapabilities(prev => ({
                          ...prev,
                          sms: e.target.checked
                        }))}
                        className="rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Image className="w-4 h-4 text-white/60" />
                        <span className="text-white">MMS</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.mms}
                        onChange={(e) => setSelectedCapabilities(prev => ({
                          ...prev,
                          mms: e.target.checked
                        }))}
                        className="rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                      />
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPurchaseModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchaseNumber}
                    disabled={isPurchasing || !areaCode || areaCode.length !== 3}
                    className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isPurchasing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Purchasing...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        <span>Purchase Number</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Market Modal */}
      {showCreateMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateMarket(false)} />
          <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
            <div className="p-6">
              <button
                onClick={() => setShowCreateMarket(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                  <Building2 className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Create Market</h3>
                  <p className="text-white/60">Create a new market area</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Market Name
                  </label>
                  <input
                    type="text"
                    value={newMarket.name}
                    onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                    placeholder="Enter market name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newMarket.description}
                    onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white h-24 resize-none"
                    placeholder="Describe this market area..."
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Assign Numbers
                  </label>
                  <div className="space-y-2">
                    {phoneNumbers.map((number) => (
                      <label
                        key={number.number}
                        className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-white/60" />
                          <span className="text-white">{number.formattedNumber}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={newMarket.numbers.includes(number.formattedNumber)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewMarket({
                                ...newMarket,
                                numbers: [...newMarket.numbers, number.formattedNumber]
                              });
                            } else {
                              setNewMarket({
                                ...newMarket,
                                numbers: newMarket.numbers.filter(n => n !== number.formattedNumber)
                              });
                            }
                          }}
                          className="rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateMarket(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const newMarketData = {
                        id: Math.random().toString(36).substr(2, 9),
                        ...newMarket,
                        status: 'active' as const,
                        createdAt: new Date().toISOString()
                      };
                      setMarkets([...markets, newMarketData]);
                      setShowCreateMarket(false);
                      setNewMarket({ name: '', description: '', numbers: [] });
                    }}
                    disabled={!newMarket.name || newMarket.numbers.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Create Market
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* API Documentation Modal */}
      {showApiDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowApiDocs(false)} />
          <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                  <Code className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Phone Provider API Documentation</h3>
                  <p className="text-white/60">Integration guides and API references</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiDocs(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
              <div className="space-y-8">
                {/* Twilio Documentation */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Twilio</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Authentication</h5>
                    <div className="space-y-2 text-sm text-white/70">
                      <p>Required credentials:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Account SID</li>
                        <li>Auth Token</li>
                        <li>API Key (optional for additional security)</li>
                      </ul>
                      <p className="mt-2">Get these from your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline">Twilio Console</a></p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Phone Numbers</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Purchase a Number</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const client = require('twilio')(accountSid, authToken);

const number = await client.availablePhoneNumbers('US')
  .local
  .list({ areaCode: '555' })
  .then(numbers => numbers[0])
  .then(number => client.incomingPhoneNumbers.create({
    phoneNumber: number.phoneNumber
  }));`}
                        </pre>
                      </div>
                      
                      <div>
                        <h6 className="text-white font-medium mb-1">List Numbers</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const numbers = await client.incomingPhoneNumbers.list();`}
                        </pre>
                      </div>
                      
                      <div>
                        <h6 className="text-white font-medium mb-1">Release a Number</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`await client.incomingPhoneNumbers(phoneNumberSid).remove();`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Voice Calls</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Make a Call</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const call = await client.calls.create({
  to: '+1234567890',
  from: '+1987654321',
  url: 'http://your-twiml-url.com/voice.xml',
  statusCallback: 'http://your-callback-url.com/status',
  statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
  statusCallbackMethod: 'POST'
});`}
                        </pre>
                      </div>
                      
                      <div>
                        <h6 className="text-white font-medium mb-1">Handle Incoming Calls</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const VoiceResponse = require('twilio').twiml.VoiceResponse;

app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Hello from ProPhone!');
  res.type('text/xml');
  res.send(twiml.toString());
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Messaging</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Send SMS</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const message = await client.messages.create({
  body: 'Hello from ProPhone!',
  to: '+1234567890',
  from: '+1987654321',
  statusCallback: 'http://your-callback-url.com/status'
});`}
                        </pre>
                      </div>
                      
                      <div>
                        <h6 className="text-white font-medium mb-1">Send MMS</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const message = await client.messages.create({
  body: 'Check out this image!',
  to: '+1234567890',
  from: '+1987654321',
  mediaUrl: ['https://example.com/image.jpg']
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telnyx Documentation */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Telnyx</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Authentication</h5>
                    <div className="space-y-2 text-sm text-white/70">
                      <p>Required credentials:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>API Key</li>
                        <li>API Secret</li>
                      </ul>
                      <p className="mt-2">Get these from your <a href="https://portal.telnyx.com" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline">Telnyx Portal</a></p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Phone Numbers</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Purchase a Number</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const telnyx = require('telnyx')(apiKey);

const number = await telnyx.numberOrders.create({
  phone_numbers: [
    {
      phone_number: '+1234567890',
      regulatory_requirements: {}
    }
  ]
});`}
                        </pre>
                      </div>
                      
                      <div>
                        <h6 className="text-white font-medium mb-1">List Numbers</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const numbers = await telnyx.phoneNumbers.list();`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Voice Calls</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Make a Call</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const call = await telnyx.calls.create({
  connection_id: 'your_connection_id',
  to: '+1234567890',
  from: '+1987654321',
  webhook_url: 'http://your-webhook-url.com/events',
  webhook_events_url: 'http://your-webhook-url.com/events'
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bandwidth Documentation */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Bandwidth</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Authentication</h5>
                    <div className="space-y-2 text-sm text-white/70">
                      <p>Required credentials:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Account ID</li>
                        <li>API Token</li>
                        <li>API Secret</li>
                      </ul>
                      <p className="mt-2">Get these from your <a href="https://dashboard.bandwidth.com" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline">Bandwidth Dashboard</a></p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Phone Numbers</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Search & Order Numbers</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const numbers = await client.PhoneNumber.search({
  areaCode: '555',
  quantity: 1,
  state: 'CA'
});

const order = await client.PhoneNumber.create({
  name: 'Main Line',
  siteId: 'your-site-id',
  phoneNumbers: numbers.phoneNumberList
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <h5 className="text-[#FFD700] font-medium mb-2">Messaging</h5>
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-white font-medium mb-1">Send Message</h6>
                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto text-sm text-white/70">
{`const message = await client.Message.send({
  from: '+1987654321',
  to: ['+1234567890'],
  text: 'Hello from ProPhone!',
  applicationId: 'your-application-id',
  tag: 'marketing'
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}