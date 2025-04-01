import React from 'react';
import { X, Mail, Lock, ArrowRight, Facebook, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SuccessModal } from './SuccessModal';
import { handleGoogleAuth, handleFacebookAuth, sendMagicCode, verifyMagicCode } from '../utils/auth';

type AuthMode = 'login' | 'signup' | 'magic' | 'google' | 'facebook';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (userData: { id: string; name: string; email: string; avatar?: string }) => void;
}

export function AuthModal({ mode, onClose, onModeChange, onSuccess }: AuthModalProps) {
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = React.useState<any | null>(null);
  const [showCompose, setShowCompose] = React.useState(false); 
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [emails, setEmails] = React.useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = React.useState('inbox');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Show account modal on first load if no accounts connected
  React.useEffect(() => {
    if (accounts.length === 0) {
      setShowAccountModal(true);
    }
  }, [accounts.length]);

  const handleConnect = async (email: string, provider: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // In a real app, this would connect to the email provider's API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAccount = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        provider,
        connected: true
      };
      
      setAccounts(prev => [...prev, newAccount]);
      setShowAccountModal(false);
    } catch (err) {
      setError('Failed to connect account');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <SuccessModal 
            onClose={() => {}} 
            message={mode === 'signup' ? 'Account created successfully!' : 'Successfully signed in!'} 
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-black/60 rounded-3xl p-8 shadow-2xl transform max-w-sm w-full mx-auto border border-[#B38B3F]/20 backdrop-blur-md transition-all duration-300 ${showSuccess ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}