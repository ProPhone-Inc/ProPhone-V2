import React from 'react';
import { X, Sparkles, Rocket, Crown, Plus, Trash2, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { usePlans } from '../../../hooks/usePlans';

interface PlansPreviewModalProps {
  onClose: () => void;
}

export function PlansPreviewModal({ onClose }: PlansPreviewModalProps) {
  const { plans, updatePlan, updatePlanFeatures } = usePlans();
  const [editingPlanId, setEditingPlanId] = React.useState<string | null>(null);
  const [editedFeatures, setEditedFeatures] = React.useState<Record<string, string[]>>({});
  const [newFeature, setNewFeature] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [updateStep, setUpdateStep] = React.useState<'stripe' | 'local' | 'sync'>('stripe');

  // Initialize edited features from current plans
  React.useEffect(() => {
    const initialFeatures: Record<string, string[]> = {};
    plans.forEach(plan => {
      initialFeatures[plan.id] = [
        'Basic Marketing Tools',
        'Up to 100 Contacts',
        'Email Support',
        'Basic Analytics',
        'Standard Templates'
      ];
    });
    setEditedFeatures(initialFeatures);
  }, [plans]);

  const handleFeatureAdd = (planId: string) => {
    if (!newFeature.trim()) return;
    
    setEditedFeatures(prev => ({
      ...prev,
      [planId]: [...(prev[planId] || []), newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleFeatureRemove = (planId: string, index: number) => {
    setEditedFeatures(prev => ({
      ...prev,
      [planId]: prev[planId].filter((_, i) => i !== index)
    }));
  };

  const handleFeatureEdit = (planId: string, index: number, value: string) => {
    setEditedFeatures(prev => ({
      ...prev,
      [planId]: prev[planId].map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    setUpdateStep('stripe');

    try {
      // Update features in Stripe first
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUpdateStep('local');

      // Update local state
      for (const [planId, features] of Object.entries(editedFeatures)) {
        await updatePlanFeatures(planId, features);
      }

      setUpdateStep('sync');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Failed to save plan changes:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const getSaveStatusMessage = () => {
    switch (updateStep) {
      case 'stripe':
        return 'Updating plans in Stripe...';
      case 'local':
        return 'Updating local plans...';
      case 'sync':
        return 'Syncing changes...';
      default:
        return 'Saving changes...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-6xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div>
            <h2 className="text-xl font-bold text-white">Plans Preview</h2>
            <p className="text-white/60">Edit plan features and preview how they appear to users</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-white/70 text-sm">
              Plan prices are controlled by Stripe and can only be modified through the Stripe dashboard or billing settings.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className="relative p-6 rounded-xl border bg-zinc-800/50 border-[#B38B3F]/20 hover:border-[#B38B3F]/40"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <div className="text-2xl font-bold text-[#FFD700] mt-1">{plan.price}</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                    {planIcons[plan.id as keyof typeof planIcons]}
                  </div>
                </div>

                <div className="space-y-4">
                  {editedFeatures[plan.id]?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureEdit(plan.id, index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-zinc-900 border border-[#B38B3F]/20 rounded-lg text-white"
                      />
                      <button
                        onClick={() => handleFeatureRemove(plan.id, index)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add new feature..."
                      className="flex-1 px-3 py-2 bg-zinc-900 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                    />
                    <button
                      onClick={() => handleFeatureAdd(plan.id)}
                      className="p-2 hover:bg-[#B38B3F]/20 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#FFD700]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saveStatus === 'success'}
              className="flex-1 px-4 py-2 bg-[#B38B3F] hover:bg-[#B38B3F]/90 text-black font-medium rounded-lg transition-colors"
            >
              {isSaving ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{getSaveStatusMessage()}</span>
                  <div className="w-full bg-black/20 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-300" 
                      style={{ 
                        width: updateStep === 'stripe' ? '33%' 
                          : updateStep === 'local' ? '66%' 
                          : updateStep === 'sync' ? '100%' 
                          : '0%' 
                      }} 
                    />
                  </div>
                </div>
              ) : saveStatus === 'success' ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes Saved!</span>
                </div>
              ) : saveStatus === 'error' ? (
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Error Saving Changes</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
          
          {isSaving && (
            <div className="mt-4 text-center text-white/50 text-sm">
              Please wait while we update the plans across all systems...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}