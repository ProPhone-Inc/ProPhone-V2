import React from 'react';
import { Users, X } from 'lucide-react';

interface TeamNamePromptModalProps {
  onSubmit: (teamName: string) => void;
  onClose: () => void;
}

export function TeamNamePromptModal({ onSubmit, onClose }: TeamNamePromptModalProps) {
  const [teamName, setTeamName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onSubmit(teamName.trim());
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <Users className="w-8 h-8 text-[#FFD700]" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text mb-3">
          Welcome to Team Management
        </h3>
        
        <p className="text-center text-white/70 mb-6">
          Let's start by giving your team a name. You can change this later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter your team name"
            className="w-full px-4 py-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent"
            autoFocus
            required
          />

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!teamName.trim()}
              className="flex-1 bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transform transition-all duration-500 hover:scale-[1.02] disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}