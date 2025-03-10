import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { usePlans } from '../../../hooks/usePlans';

interface EditPlanModalProps {
  plan: {
    id: string;
    name: string;
    price: string;
    users: number;
    revenue: string;
  };
  onClose: () => void;
  onSave: (planId: string, newPrice: string) => void;
}

export function EditPlanModal({ plan, onClose, onSave }: EditPlanModalProps) {
  const { updatePlan, syncWithStripe } = usePlans();
  const [newPrice, setNewPrice] = React.useState(plan.price.replace('$', ''));
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUpdatingStripe, setIsUpdatingStripe] = React.useState(false);
  const [updateStatus, setUpdateStatus] = React.useState<'idle' | 'updating-stripe' | 'updating-system' | 'notifying-users'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setUpdateStatus('updating-stripe');
    const newPriceWithSymbol = `$${newPrice}`;

    try {
      // Update price in Stripe
      setIsUpdatingStripe(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate Stripe API call
      
      // Update local state immediately for real-time UI updates
      updatePlan(plan.id, { price: newPriceWithSymbol });
      
      // Update system-wide pricing
      setUpdateStatus('updating-system');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate system update
      
      // Sync with Stripe to ensure consistency
      await syncWithStripe();
      
      // Notify affected users
      setUpdateStatus('notifying-users');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate email notifications
      
      await onSave(plan.id, newPriceWithSymbol);
      onClose();
    } finally {
      setIsSubmitting(false);
      setIsUpdatingStripe(false);
      setUpdateStatus('idle');
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Price Change</h3>
              <p className="text-white/60 text-sm">This will update pricing in Stripe and across the platform</p>
            </div>
          </div>

          <p className="text-white/70 mb-6">
            Are you sure you want to change the price of {plan.name} from {plan.price} to ${newPrice}?
            This will:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-white/70">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Update product pricing in Stripe
            </li>
            <li className="flex items-center text-white/70">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Sync new pricing across the platform
            </li>
            <li className="flex items-center text-white/70">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Send email notifications to all {plan.users} users on this plan
            </li>
            <li className="flex items-center text-white/70">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Take effect on users' next billing cycle
            </li>
            <li className="flex items-center text-white/70">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
              Update all plan marketing materials
            </li>
          </ul>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {updateStatus === 'updating-stripe' && 'Updating Stripe...'}
                      {updateStatus === 'updating-system' && 'Syncing Platform...'}
                      {updateStatus === 'notifying-users' && 'Notifying Users...'}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-300" 
                      style={{ 
                        width: updateStatus === 'updating-stripe' ? '33%' 
                          : updateStatus === 'updating-system' ? '66%' 
                          : updateStatus === 'notifying-users' ? '100%' 
                          : '0%' 
                      }} 
                    />
                  </div>
                </div>
              ) : (
                'Confirm Change'
              )}
            </button>
          </div>
          
          {isSubmitting && (
            <div className="mt-4 text-center text-white/50 text-sm">
              Please wait while we update pricing across all systems...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Edit Plan Pricing</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Plan Name</label>
            <input
              type="text"
              value={plan.name}
              disabled
              className="w-full px-3 py-2 bg-zinc-800/50 border border-[#B38B3F]/20 rounded-lg text-white/50"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Current Price</label>
            <input
              type="text"
              value={plan.price}
              disabled
              className="w-full px-3 py-2 bg-zinc-800/50 border border-[#B38B3F]/20 rounded-lg text-white/50"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">New Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full pl-7 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div className="bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-lg p-4">
            <h4 className="text-[#635BFF] font-medium mb-2">Price Change Impact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#635BFF] rounded-full mr-2" />
                {plan.users} users will be affected
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#635BFF] rounded-full mr-2" />
                Changes take effect next billing cycle
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#635BFF] rounded-full mr-2" />
                All users will be notified via email
              </li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-medium rounded-lg transition-colors"
            >
              Update Price
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}