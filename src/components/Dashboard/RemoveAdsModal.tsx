import React from 'react';
import { X, Ban, Info } from 'lucide-react';

interface RemoveAdsModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export function RemoveAdsModal({ onClose, onSubscribe }: RemoveAdsModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      // In a real app, this would integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubscribe();
      onClose();
    } catch (error) {
      console.error('Failed to process subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Ban className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Remove Ads</h3>
              <p className="text-white/60">Enjoy an ad-free experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
              <h4 className="text-[#FFD700] font-medium mb-2">Benefits</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full mr-2" />
                  Remove all advertisements across the platform
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full mr-2" />
                  Cleaner, distraction-free interface
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full mr-2" />
                  Support further development
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full mr-2" />
                  <span>$10/month per account</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$10<span className="text-lg text-white/60">/month</span></div>
              <p className="text-white/60 text-sm">Cancel anytime</p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Upgrade Now</span>
                  <Ban className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}