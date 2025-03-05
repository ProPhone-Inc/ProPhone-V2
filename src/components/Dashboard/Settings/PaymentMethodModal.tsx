import React from 'react';
import { X, CreditCard, Lock, AlertTriangle } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_sample');

interface PaymentMethodModalProps {
  onClose: () => void;
  onSuccess: (paymentMethod: any) => void;
}

function PaymentMethodForm({ onClose, onSuccess }: PaymentMethodModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cardData, setCardData] = React.useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
    }
    
    // Limit month to 2 digits and valid values (1-12)
    if (name === 'expMonth') {
      value = value.replace(/\D/g, '').substring(0, 2);
      const num = parseInt(value);
      if (num > 12) value = '12';
    }
    
    // Limit year to 2 digits
    if (name === 'expYear') {
      value = value.replace(/\D/g, '').substring(0, 2);
    }
    
    // Limit CVC to 3-4 digits
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);
    setError(null);

    try {
      // Validate card data
      if (!cardData.number || !cardData.expMonth || !cardData.expYear || !cardData.cvc) {
        throw new Error('Please fill in all card details');
      }

      // Format card data for Stripe
      const cardNumber = cardData.number.replace(/\s/g, '');
      const expMonth = parseInt(cardData.expMonth);
      const expYear = parseInt('20' + cardData.expYear);

      // In a real app, send to your backend to create payment method
      // For demo, simulate success after validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPaymentMethod = {
        id: 'pm_' + Math.random().toString(36).substr(2, 9),
        card: {
          brand: 'visa',
          last4: cardNumber.slice(-4),
          exp_month: expMonth,
          exp_year: expYear
        },
        isDefault: true
      };

      onSuccess(mockPaymentMethod);
    } catch (err) {
      console.error('Payment method error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 w-[500px] rounded-xl border border-[#B38B3F]/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">Add Payment Method</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Card Information
            </label>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="text"
                  name="number"
                  placeholder="Card number"
                  value={cardData.number}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="expMonth"
                    placeholder="MM"
                    value={cardData.expMonth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="expYear"
                    placeholder="YY"
                    value={cardData.expYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    value={cardData.cvc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-white/50 text-sm">
            <Lock className="w-4 h-4" />
            <span>Your payment information is securely processed by Stripe</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>Processing</span>
                </div>
              ) : (
                'Add Payment Method'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PaymentMethodModal(props: PaymentMethodModalProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodForm {...props} />
    </Elements>
  );
}