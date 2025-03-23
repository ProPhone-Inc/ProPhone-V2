import React from 'react';
import { X, Phone, Search, Filter, Check, AlertTriangle } from 'lucide-react';
import { usePhoneProvider } from '../../../hooks/usePhoneProvider';

interface PurchaseNumberModalProps {
  onClose: () => void;
  onPurchase: (number: { number: string; formattedNumber: string }) => void;
  providerId: string;
}

export function PurchaseNumberModal({ onClose, onPurchase, providerId }: PurchaseNumberModalProps) {
  const [areaCode, setAreaCode] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { purchasePhoneNumber } = usePhoneProvider();

  const handlePurchase = async () => {
    if (!areaCode.trim() || !/^\d{3}$/.test(areaCode)) {
      setError('Please enter a valid 3-digit area code');
      return;
    }

    setError(null);
    setIsPurchasing(true);

    try {
      const number = await purchasePhoneNumber(areaCode);
      onPurchase(number);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to purchase number');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Phone className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Purchase Number</h2>
              <p className="text-white/60">Add a new phone line</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Area Code
            </label>
            <input
              type="text"
              maxLength={3}
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 3-digit area code"
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={isPurchasing || !areaCode.trim() || !/^\d{3}$/.test(areaCode)}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              {isPurchasing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Purchasing...</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Purchase Number</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}