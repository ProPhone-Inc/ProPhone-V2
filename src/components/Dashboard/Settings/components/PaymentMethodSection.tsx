import React from 'react';
import { Plus, AlertTriangle, CreditCard } from 'lucide-react';

interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault: boolean;
}

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  onAddPaymentMethod: () => void;
}

export function PaymentMethodSection({
  paymentMethods,
  isLoading,
  onAddPaymentMethod
}: PaymentMethodSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Payment Method</h2>
        <button 
          onClick={onAddPaymentMethod}
          className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
        </div>
      ) : paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">•••• •••• •••• {method.card.last4}</div>
                    <div className="text-sm text-white/60">
                      Expires {method.card.exp_month}/{method.card.exp_year}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      Default
                    </span>
                  )}
                  <button className="text-white/60 hover:text-white transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-white/50">
          No payment methods added yet
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-amber-400 font-medium">Payment Security</h4>
          <p className="text-amber-400/80 text-sm mt-1">
            All payment information is securely processed and stored by Stripe. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
}