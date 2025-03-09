import React from 'react';
import { X, UserCheck } from 'lucide-react';
import { sendReactivationEmail } from '../../../utils/email';

interface ReactivateUserModalProps {
  user: any;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  onConfirm: () => void;
}

export function ReactivateUserModal({ user, onClose, modalRef, onConfirm }: ReactivateUserModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleReactivate = async () => {
    setIsSubmitting(true);
    try {
      await sendReactivationEmail(user.email);
      onConfirm();
    } catch (error) {
      console.error('Failed to send reactivation email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div 
        ref={modalRef}
        className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Reactivate User Account</h3>
        </div>
        
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
        
        <div className="space-y-4 mb-6">
          <p className="text-white/70">
            Are you sure you want to reactivate this user? This will:
          </p>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
              Restore full access to all platform features
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
              Allow the user to log in again
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
              Maintain their previous data and settings
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
              Send an email notification about the reactivation
            </li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReactivate}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Reactivating...</span>
              </div>
            ) : (
              'Reactivate User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}