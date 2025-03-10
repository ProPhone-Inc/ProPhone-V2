import React from 'react';
import { Bot, AlertTriangle, CheckCircle2, ArrowUpRight, Code, Copy, ExternalLink, Book, RefreshCw, Plus, PenSquare, Trash2 } from 'lucide-react';
import { useCopilot } from '../../../hooks/useCopilot';

type CopilotSectionProps = {
  userData: any;
};

export function CopilotSection({ userData }: CopilotSectionProps) {

  const { provider, apiKey, configurations, addConfiguration, updateConfiguration, removeConfiguration, setActiveConfiguration, clearSettings } = useCopilot();
  const [showDocs, setShowDocs] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [testResult, setTestResult] = React.useState<'success' | 'error' | null>(null);
  const [updateStep, setUpdateStep] = React.useState<'stripe' | 'local' | 'sync'>('stripe');
  const [isResetting, setIsResetting] = React.useState(false);
  const [newConfig, setNewConfig] = React.useState({
    name: '',
    provider: '',
    apiKey: ''
  });
  const [isAdding, setIsAdding] = React.useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      clearSettings();
      setTestResult(null);
      setError(null);
    } finally {
      setIsResetting(false);
    }
  };

  const providers = [
    { 
      id: 'openai', 
      name: 'OpenAI', 
      description: 'GPT-4 and GPT-3.5 Turbo models',
      keyFormat: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
      keyPrefix: 'sk-',
      docsUrl: 'https://platform.openai.com/docs/api-reference',
      apiUrl: 'https://api.openai.com/v1/chat/completions'
    },
    { 
      id: 'anthropic', 
      name: 'Anthropic', 
      description: 'Claude and Claude Instant models',
      keyFormat: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      keyPrefix: 'sk-ant-',
      docsUrl: 'https://docs.anthropic.com/claude/reference',
      apiUrl: 'https://api.anthropic.com/v1/messages'
    },
    { 
      id: 'google', 
      name: 'Google', 
      description: 'PaLM and Gemini models',
      keyFormat: 'AIzaSy...', 
      keyPrefix: 'AIzaSy',
      docsUrl: 'https://ai.google.dev/docs',
      apiUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
    }
  ] as const;

  const handleAddConfig = async () => {
    if (!newConfig.name || !newConfig.provider || !newConfig.apiKey) {
      setError('All fields are required');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Validate API key format
      const provider = providers.find(p => p.id === newConfig.provider);
      if (provider && !newConfig.apiKey.startsWith(provider.keyPrefix)) {
        throw new Error(`Invalid API key format. Key must start with ${provider.keyPrefix}`);
      }

      // Add configuration
      addConfiguration({
        name: newConfig.name,
        provider: newConfig.provider as 'openai' | 'anthropic' | 'google',
        apiKey: newConfig.apiKey
      });

      // Reset form
      setNewConfig({ name: '', provider: '', apiKey: '' });
      setIsAdding(false);
      setTestResult('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add configuration');
      setTestResult('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <Bot className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">CoPilot Configuration</h2>
            <p className="text-white/60">Configure your AI assistant settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Settings</span>
          </button>
          <button
            onClick={() => setShowDocs(true)}
            className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center space-x-1"
          >
            <Book className="w-4 h-4" />
            <span>API Docs</span>
          </button>
        </div>
      </div>

      {!provider && !apiKey && (
        <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Bot className="w-5 h-5 text-[#FFD700] mt-1" />
            <div>
              <h4 className="text-[#FFD700] font-medium">Welcome to CoPilot!</h4>
              <p className="text-white/70 text-sm mt-1">
                Get started by selecting your preferred AI provider below and configuring your API key.
                Your CoPilot will help you automate tasks, analyze data, and boost productivity.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Saved Configurations */}
        {configurations.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Saved Configurations</h3>
            <div className="grid grid-cols-2 gap-4">
              {configurations.map((config) => (
                <div 
                  key={config.id}
                  className={`p-4 rounded-lg border ${
                    config.isActive 
                      ? 'bg-[#B38B3F]/20 border-[#B38B3F]/40' 
                      : 'bg-zinc-800 border-[#B38B3F]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{config.name}</div>
                      <div className="text-sm text-white/60">{config.provider}</div>
                      {config.isActive && (
                        <div className="text-xs text-[#FFD700] mt-1">Active Configuration</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!config.isActive && (
                        <button
                          onClick={() => setActiveConfiguration(config.id)}
                          className="px-2 py-1 text-sm text-[#FFD700] hover:bg-[#FFD700]/10 rounded transition-colors"
                        >
                          Make Active
                        </button>
                      )}
                      <button
                        onClick={() => removeConfiguration(config.id)}
                        disabled={config.isActive}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Configuration */}
        {isAdding ? (
          <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Add New Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Configuration Name</label>
                <input
                  type="text"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Configuration"
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Provider</label>
                <select
                  value={newConfig.provider}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, provider: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                >
                  <option value="">Select Provider</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={newConfig.apiKey}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key"
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewConfig({ name: '', provider: '', apiKey: '' });
                    setError(null);
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddConfig}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    'Add Configuration'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 px-4 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Configuration</span>
          </button>
        )}

        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            AI Provider
          </label>
          <div className="grid grid-cols-3 gap-4">
            {providers.map((p) => (
              <label
                key={p.id}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    provider === p.id
                      ? 'bg-[#B38B3F]/20 border border-[#B38B3F]/40'
                      : 'bg-zinc-800 border border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
                  }
                `}
              >
                <input
                  type="radio"
                  name="provider"
                  value={p.id}
                  checked={provider === p.id}
                  onChange={(e) => updateConfiguration(e.target.value)}
                  className="sr-only"
                />
                <div>
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-sm text-white/60">{p.description}</div>
                  {provider === p.id && !isProcessing && (
                    <div className="text-xs text-[#FFD700] mt-1">Currently Active</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
          <h4 className="text-[#FFD700] font-medium mb-2">Important Notes</h4>
          <ul className="grid grid-cols-2 gap-4 text-sm text-white/70">
            <li className="flex items-start">
              <span className="w-2 h-2 mt-1.5 bg-[#FFD700] rounded-full mr-2 flex-shrink-0" />
              API keys are encrypted before storage
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-1.5 bg-[#FFD700] rounded-full mr-2 flex-shrink-0" />
              Only you can view or modify your key
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-1.5 bg-[#FFD700] rounded-full mr-2 flex-shrink-0" />
              Key is automatically rotated every 90 days
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-1.5 bg-[#FFD700] rounded-full mr-2 flex-shrink-0" />
              All API calls are logged and monitored
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}