import React from 'react';
import { X, Ban } from 'lucide-react';
import { sendSuspensionEmail } from '../../../utils/email';

interface SuspendUserModalProps {
  user: any;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  onConfirm: (reason: string) => void;
}

export function SuspendUserModal({ user, onClose, modalRef, onConfirm }: SuspendUserModalProps) {
  const [selectedReason, setSelectedReason] = React.useState('');
  const [customReason, setCustomReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const suspensionReasons = [
    'Violation of Terms of Service',
    'Suspicious Activity',
    'Payment Issue',
    'Account Security Concern',
    'Other (specify below)'
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const reason = selectedReason === 'Other (specify below)' ? customReason : selectedReason;
    
    try {
      await sendSuspensionEmail(user.email, reason);
      onConfirm(reason);
    } catch (error) {
      console.error('Failed to send suspension email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" onClick={onClose} />
      <div 
        ref={modalRef}
        className="relative bg-black/60 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto backdrop-blur-md"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Ban className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Suspend User Account</h3>
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
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Suspension Reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white mb-4"
              required
            >
              <option value="">Select a reason</option>
              {suspensionReasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>

            {selectedReason === 'Other (specify below)' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify the reason for suspension..."
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white h-24 resize-none"
                required
              />
            )}
          </div>

          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Immediately revoke access to all platform features
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Prevent the user from logging in
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Maintain their data and settings for future reactivation
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Send an email notification with the specified reason
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
            onClick={handleSubmit}
            disabled={!selectedReason || (selectedReason === 'Other (specify below)' && !customReason) || isSubmitting}
            className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Suspending...</span>
              </div>
            ) : (
              'Suspend User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}