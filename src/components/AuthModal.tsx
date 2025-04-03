import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Facebook, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { handleGoogleAuth, handleFacebookAuth, sendMagicCode, verifyMagicCode } from '../utils/auth';
import { SuccessModal } from './SuccessModal';

type AuthMode = 'login' | 'signup' | 'magic' | 'google' | 'facebook';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (userData: { id: string; name: string; email: string; avatar?: string }) => void;
}

export function AuthModal({ mode, onClose, onModeChange, onSuccess }: AuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    // Directly handle social authentication
    setIsLoading(true);
    setError(null);
    
    try {
      let userData;
      if (provider === 'google') {
        userData = await handleGoogleAuth();
      } else {
        userData = await handleFacebookAuth();
      }
      
      if (userData) {
        setShowSuccess(true);
        
        // Store user data in localStorage directly
        localStorage.setItem('auth_user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: 'user'
        }));
        
        // Set auth token (in a real app this would come from the backend)
        localStorage.setItem('auth_token', 'test-token-' + Math.random().toString(36).substr(2));
        
        // Force redirect to dashboard after a delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error) {
      console.error('Social auth error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {showSuccess && (
        <SuccessModal onClose={onClose} />
      )}

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-black/60 rounded-3xl p-8 shadow-2xl transform max-w-sm w-full mx-auto border border-[#B38B3F]/20 backdrop-blur-md transition-all duration-300 ${showSuccess ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <>
          {mode === 'google' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Sign in with Google</h3>
              <p className="text-white/60 mb-6">Click the button below to continue with your Google account</p>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2 mb-4">
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={() => handleSocialAuth('google')}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Google</span>
                )}
              </button>
            </div>
          )}
          
          {mode === 'facebook' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1877F2] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Sign in with Facebook</h3>
              <p className="text-white/60 mb-6">Click the button below to continue with your Facebook account</p>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2 mb-4">
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={() => handleSocialAuth('facebook')}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Facebook</span>
                )}
              </button>
            </div>
          )}
          
          {mode === 'login' && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Sign in</h3>
              <p className="text-white/60 mb-6">Choose a login method to continue</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => onModeChange('google')}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
                >
                  <div className="w-5 h-5 relative">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <span className="text-white">Continue with Google</span>
                </button>
                
                <button
                  onClick={() => onModeChange('facebook')}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-white">Continue with Facebook</span>
                </button>
              </div>
            </div>
          )}
          
          {mode === 'signup' && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Create Account</h3>
              <p className="text-white/60 mb-6">Choose a signup method to continue</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => onModeChange('google')}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
                >
                  <div className="w-5 h-5 relative">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <span className="text-white">Sign up with Google</span>
                </button>
                
                <button
                  onClick={() => onModeChange('facebook')}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-white">Sign up with Facebook</span>
                </button>
              </div>
            </div>
          )}
          
          {mode === 'magic' && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Magic Link</h3>
              <p className="text-white/60 mb-6">We'll send you a magic link to sign in instantly</p>
              
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send Magic Link
                </button>
              </form>
            </div>
          )}
        </>
      </div>
    </div>
  );
}