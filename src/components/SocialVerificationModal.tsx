import React from 'react';
import { X, Loader } from 'lucide-react';

interface SocialVerificationModalProps {
  provider: 'google' | 'facebook';
  onClose: () => void;
  onVerify: () => void;
  handleGoogleAuth: () => Promise<any>;
  handleFacebookAuth: () => Promise<any>;
}

export function SocialVerificationModal({ 
  provider, 
  onClose, 
  onVerify,
  handleGoogleAuth,
  handleFacebookAuth 
}: SocialVerificationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      const allowedOrigins = [
        'https://accounts.google.com',
        'https://www.facebook.com'
      ];

      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data.type === 'AUTH_SUCCESS') {
        onVerify();
      } else if (event.data.type === 'AUTH_ERROR') {
        setAuthError(event.data.error || 'Authentication failed');
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onVerify]);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await handleGoogleAuth();
      } else {
        await handleFacebookAuth();
      }
      setIsLoading(false);
      onVerify();
    } catch (error) {
      setIsLoading(false);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  React.useEffect(() => {
    handleAuth();
  }, [provider]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black/60 rounded-3xl p-8 shadow-2xl transform animate-fade-in max-w-sm w-full mx-auto border border-[#B38B3F]/20 backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center justify-center mb-6">
          {provider === 'google' ? (
            <div className="w-12 h-12 relative">
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
          ) : (
            <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text mb-3">
          Sign in with {provider === 'google' ? 'Google' : 'Facebook'}
        </h3>

        <div className="p-6 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin mb-4" />
              <p className="text-white/70">Authenticating with {provider === 'google' ? 'Google' : 'Facebook'}...</p>
            </div>
          ) : authError ? (
            <div className="py-8">
              <div className="text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="mt-4">{authError}</p>
              </div>
              <button
                onClick={() => {
                  setAuthError(null);
                  handleAuth();
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="py-8">
              <p className="text-white/70 mb-6">
                Please complete the authentication process with {provider === 'google' ? 'Google' : 'Facebook'}.
              </p>
              <button
                onClick={handleAuth}
                className="px-6 py-3 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Complete Authentication
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}