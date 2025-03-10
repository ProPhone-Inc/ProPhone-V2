import React from 'react';
import { X, Check } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  logo: string;
  lines: string[];
}

interface ProviderModalProps {
  onClose: () => void;
  onSelect: (providerId: string) => void;
  selectedProvider: string | null;
}

export function ProviderModal({ onClose, onSelect, selectedProvider }: ProviderModalProps) {
  const providers: Provider[] = [
    {
      id: 'att',
      name: 'AT&T',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/att.png',
      lines: ['1', '2']
    },
    {
      id: 'verizon',
      name: 'Verizon',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/verizon.png',
      lines: ['3', '4']
    },
    {
      id: 'tmobile',
      name: 'T-Mobile',
      logo: 'https://dallasreynoldstn.com/wp-content/uploads/2025/03/tmobile.png',
      lines: ['5']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h3 className="text-xl font-bold text-white">Select Provider</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onSelect(provider.id)}
              className={`w-full flex items-center p-4 rounded-lg border transition-all ${
                selectedProvider === provider.id
                  ? 'bg-[#B38B3F]/20 border-[#B38B3F]/40'
                  : 'bg-zinc-800/50 border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4">
                <img src={provider.logo} alt={provider.name} className="w-8 h-8 object-contain" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-white">{provider.name}</div>
                <div className="text-sm text-white/60">{provider.lines.length} lines</div>
              </div>
              {selectedProvider === provider.id && (
                <div className="w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}