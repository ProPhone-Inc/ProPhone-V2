import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
  message?: string;
}

export function SuccessModal({ onClose, message }: SuccessModalProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-black/60 rounded-3xl p-8 shadow-2xl transform animate-fade-in max-w-sm w-full mx-auto border border-[#B38B3F]/20 backdrop-blur-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/20 flex items-center justify-center border border-[#B38B3F]/40">
            <svg className="w-8 h-8 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text mb-3">
          Success!
        </h3>
        <p className="text-center text-white/70">
          {message || 'Your password has been successfully updated. Redirecting to login...'}
        </p>
      </div>
    </div>
  );
}