import React from 'react';
import { X } from 'lucide-react';

interface DeleteTeamMemberModalProps {
  member: any;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  onConfirm: () => void;
}

export function DeleteTeamMemberModal({ member, onClose, modalRef, onConfirm }: DeleteTeamMemberModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" onClick={onClose} />
      <div 
        ref={modalRef}
        className="relative bg-black/60 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto backdrop-blur-md overflow-hidden">
        {(member.role === 'owner' || member.role === 'super_admin') && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <p className="text-white/70 text-center px-6">
              Team Admin accounts cannot be deleted
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4">Remove Team Member?</h3>
        
        <div className="flex items-center space-x-3 mb-6 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=B38B3F&color=fff`} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-white">{member.name}</p>
            <p className="text-sm text-white/60">{member.email}</p>
          </div>
        </div>
        
        <p className="text-white/70 mb-6">
          Are you sure you want to remove this team member? They will lose access to all features and their account will be deactivated.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Remove Member
          </button>
        </div>
      </div>
    </div>
  );
}