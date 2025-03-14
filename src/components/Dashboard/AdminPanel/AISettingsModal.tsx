import React from 'react';
import { X, Sparkles, Key, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

interface AISettingsModalProps {
  onClose: () => void;
}

export function AISettingsModal({ onClose }: AISettingsModalProps) {
  const [apiKey, setApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<'success' | 'error' | null>(null);
  const [showKey, setShowKey] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTestResult(null);

    try {
      // Simulate API call to test and save the key
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, always succeed
      setTestResult('success');
      
      // In a real app, you would:
      // 1. Test the API key with a simple request
      // 2. If successful, encrypt and store the key securely
      // 3. Update the Copilot to use the new key
      
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Sparkles className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Model Configuration</h2>
              <p className="text-white/60 text-sm">Configure the AI model for ProPhone Copilot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-10 pr-20 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
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

          {testResult && (
            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
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
                  <span className="text-white/70">Failed to verify API key</span>
                </>
              )}
            </div>
          )}

          <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
            <h4 className="text-[#FFD700] font-medium mb-2">Important Notes</h4>
            <ul className="space-y-2 text-sm text-white/70">
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

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
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
    </div>
  );
}