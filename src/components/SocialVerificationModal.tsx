import React from 'react';
import { X } from 'lucide-react';

interface SocialVerificationModalProps {
  provider: 'google' | 'facebook';
  onClose: () => void;
  onVerify: () => void;
}

export function SocialVerificationModal({ provider, onClose, onVerify }: SocialVerificationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

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
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onVerify]);

  const getAuthUrl = () => {
    if (provider === 'google') {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = window.location.origin;
      return `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent('openid email profile')}`;
    } else {
      const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
      const redirectUri = window.location.origin;
      return `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookAppId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=email,public_profile`;
    }
  };

  React.useEffect(() => {
    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = getAuthUrl();
    }
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
        
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            title={`${provider} login`}
          />
        </div>
      </div>
    </div>
  );
}