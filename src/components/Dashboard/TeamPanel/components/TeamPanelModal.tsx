import React from 'react';
import { X, UserCog } from 'lucide-react';
import { TeamPanel } from '../TeamPanel';
import { db } from '../../../../db';

interface TeamPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamPanelModal({ isOpen, onClose }: TeamPanelModalProps) {
  const [teamName, setTeamName] = React.useState(() => {
    return localStorage.getItem('teamName') || 'My Team';
  });
  const [totalMembers, setTotalMembers] = React.useState(0);

  React.useEffect(() => {
    const loadTeamMembers = async () => {
      const users = await db.users.toArray();
      setTotalMembers(users.length);
    };
    loadTeamMembers();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-4rem)] max-w-7xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">Team Management</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <TeamPanel />
        </div>
      </div>
    </div>
  );
}