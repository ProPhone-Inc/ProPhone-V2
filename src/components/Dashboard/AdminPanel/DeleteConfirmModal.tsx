import React from 'react';

interface DeleteConfirmModalProps {
  user: any;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ user, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <h3 className="text-xl font-bold text-white mb-4">Delete User?</h3>
        
        <div className="flex items-center space-x-3 mb-6 p-3 bg-zinc-800 rounded-lg border border-[#B38B3F]/10">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=B38B3F&color=fff`} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-sm text-white/60">{user.email}</p>
          </div>
        </div>
        
        <p className="text-white/70 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
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
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}