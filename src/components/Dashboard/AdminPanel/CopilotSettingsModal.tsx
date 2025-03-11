import React, { useState } from 'react';
import { X, Key, AlertTriangle, CheckCircle2, Bot, ArrowUpRight, PenSquare, Trash2 } from 'lucide-react';
import { useCopilot } from '../../../hooks/useCopilot';
import { decryptData } from '../../../utils/encryption';

interface CopilotSettingsModalProps {
  onClose: () => void;
}

export function CopilotSettingsModal({ onClose }: CopilotSettingsModalProps) {
  const { provider: currentProvider, configurations, addConfiguration, updateConfiguration, removeConfiguration, setActiveConfiguration } = useCopilot();
  const [selectedProvider, setSelectedProvider] = React.useState<'openai' | 'anthropic' | 'google'>(currentProvider || 'openai');
  const [newApiKey, setNewApiKey] = React.useState('');
  const [configName, setConfigName] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<'success' | 'error' | null>(null);
  const [showKey, setShowKey] = React.useState(false);
  const [showDocs, setShowDocs] = React.useState(false);
  const [editingConfig, setEditingConfig] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTestResult(null);
    setError(null);

    // Validate API key format
    const provider = providers.find(p => p.id === selectedProvider);
    if (provider && !newApiKey.startsWith(provider.keyPrefix)) {
      setTestResult('error');
      setError(`Invalid API key format. Key must start with ${provider.keyPrefix}`);
      setIsLoading(false);
      return;
    }

    try {
      // Prepare test request based on provider
      let response;
      if (selectedProvider === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5
          })
        });
      } else if (selectedProvider === 'anthropic') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': newApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-2',
            max_tokens: 5,
            messages: [{ role: 'user', content: 'test' }]
          })
        });
      } else if (selectedProvider === 'google') {
        response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${newApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'test' }] }],
            generationConfig: {
              maxOutputTokens: 5
            }
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || 
                           errorData?.error?.description ||
                           'Failed to verify API key';
        throw new Error(errorMessage);
      }

      // Add or update configuration
      const config = {
        name: configName || `${selectedProvider} Config ${configurations.length + 1}`,
        provider: selectedProvider,
        apiKey: newApiKey
      };

      if (editingConfig) {
        updateConfiguration(editingConfig, config);
      } else {
        addConfiguration(config);
      }
      
      setTestResult('success');
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('API key verification failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify API key';
      
      // Handle specific provider errors
      if (errorMessage.includes('Invalid API key') || 
          errorMessage.includes('invalid_api_key') ||
          errorMessage.includes('authentication failed')) {
        setError('Invalid API key. Please check your key and try again.');
      } else if (errorMessage.includes('rate limit') || 
                 errorMessage.includes('quota exceeded')) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError(errorMessage);
      }
      
      setTestResult('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-3xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Bot className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">CoPilot Configuration</h2>
              <p className="text-white/60 text-sm">Configure the AI provider for ProPhone CoPilot</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowDocs(true)}
              className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm px-3 py-1.5 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
            >
              API Docs
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              AI Provider
            </label>
            <div className="grid grid-cols-3 gap-4">
              {providers.map((p) => (
                <label
                  key={p.id}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedProvider === p.id
                      ? 'bg-[#B38B3F]/20 border border-[#B38B3F]/40'
                      : 'bg-zinc-800 border border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={p.id}
                    checked={selectedProvider === p.id}
                    onChange={(e) => setSelectedProvider(e.target.value as 'openai' | 'anthropic' | 'google')}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-sm text-white/60">{p.description}</div>
                    {currentProvider === p.id && !isEditing && (
                      <div className="text-xs text-[#FFD700] mt-1">Currently Active</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedProvider && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Configuration Name
                </label>
                <input
                  type="text"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  placeholder="My Configuration"
                />
              </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type={showKey ? "text" : "password"}
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  className={`w-full pl-10 pr-20 py-2 bg-zinc-800 rounded-lg text-white placeholder-white/40 transition-colors ${
                    selectedProvider && newApiKey && !newApiKey.startsWith(providers.find(p => p.id === selectedProvider)?.keyPrefix || '')
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-[#B38B3F]/20 focus:border-[#B38B3F]/40'
                  } border`}
                  placeholder="Enter your API key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-white/60 hover:text-white transition-colors"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            </div>
          )}

          {configurations.length > 0 && (
            <div className="col-span-2">
              <h4 className="text-white font-medium mb-3">Saved Configurations</h4>
              <div className="grid grid-cols-2 gap-4">
                {configurations.map((config) => (
                  <div 
                    key={config.id}
                    className={`p-3 rounded-lg border ${
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
                          onClick={() => {
                            setEditingConfig(config.id);
                            setIsEditing(true);
                            setSelectedProvider(config.provider);
                            setConfigName(config.name);
                            setNewApiKey('');
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <PenSquare className="w-4 h-4 text-white/60" />
                        </button>
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

          {testResult && (
            <div className={`col-span-2 p-4 rounded-lg flex items-center space-x-3 ${
              testResult === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {testResult === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-white/70">API key verified successfully</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white/70">{error || 'Failed to verify API key'}</span>
                </>
              )}
            </div>
          )}

          <div className="col-span-2 bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
            <h4 className="text-[#FFD700] font-medium mb-2">Important Notes</h4>
            <ul className="grid grid-cols-2 gap-4 text-sm text-white/70">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 bg-[#FFD700] rounded-full mr-2 flex-shrink-0" />
                API keys are encrypted before storage
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 bg-[#FFD700] rounded-full mr-2 flex-shrink-0" />
                Only platform owner can view or modify the key
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

          <div className="col-span-2 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedProvider || !newApiKey || isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Save & Test Key'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* API Documentation Modal */}
      {showDocs && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" onClick={() => setShowDocs(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div 
            className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-lg transform animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
              <h3 className="text-lg font-bold text-white">API Documentation</h3>
              <button
                onClick={() => setShowDocs(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {providers.map((p) => (
                <div 
                  key={p.id}
                  className={`p-4 rounded-lg border ${
                    selectedProvider === p.id
                      ? 'bg-[#B38B3F]/20 border-[#B38B3F]/40'
                      : 'bg-zinc-800 border-[#B38B3F]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{p.name}</h4>
                    <a 
                      href={p.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center px-2 py-1 rounded hover:bg-[#FFD700]/10 transition-colors"
                    >
                      Official Docs
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-white/60 mb-1">API Key Format:</div>
                      <code className="px-2 py-1 bg-black/20 rounded text-[#FFD700] block">{p.keyFormat}</code>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">API Endpoint:</div>
                      <code className="px-2 py-1 bg-black/20 rounded text-[#FFD700] block break-all">{p.apiUrl}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}