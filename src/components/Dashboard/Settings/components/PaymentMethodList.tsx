import React from 'react';
import { CreditCard } from 'lucide-react';

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

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  onEdit: (method: PaymentMethod) => void;
}

export function PaymentMethodList({ paymentMethods, isLoading, onEdit }: PaymentMethodListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        No payment methods added yet
      </div>
    );
  }

  return (
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
              <button 
                onClick={() => onEdit(method)}
                className="text-white/60 hover:text-white transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}