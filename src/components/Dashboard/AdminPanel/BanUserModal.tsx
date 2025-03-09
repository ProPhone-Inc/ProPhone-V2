import React from 'react';
import { X, Ban } from 'lucide-react';
import { sendBanEmail } from '../../../utils/email';

interface BanUserModalProps {
  user: any;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function BanUserModal({ user, onClose, onConfirm }: BanUserModalProps) {
  const [reason, setReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Send ban notification email
      await sendBanEmail(user.email, reason);
      
      // Confirm ban and trigger account deletion
      onConfirm(reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-red-500/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Ban className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Ban User Account</h3>
        </div>
        
        <div className="flex items-center space-x-3 mb-6 p-3 bg-zinc-800 rounded-lg border border-red-500/10">
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
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Ban Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please specify the reason for banning this user..."
              className="w-full px-3 py-2 bg-zinc-800 border border-red-500/20 rounded-lg text-white h-24 resize-none"
              required
            />
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-red-400 font-medium mb-2">Warning</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                Permanently block access to all platform features
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                Prevent future sign-ups with this email
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                Add email to platform-wide ban list
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                This action can only be reversed by the platform owner
              </li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Banning User...</span>
              </div>
            ) : (
              'Ban User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}