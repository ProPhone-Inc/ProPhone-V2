import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface PlansSectionProps {
  plans: Plan[];
  onUpgrade: (plan: Plan) => void;
  onCancel: () => void;
}

export function PlansSection({ plans, onUpgrade, onCancel }: PlansSectionProps) {
  return (
    <div>
      <div className="space-y-6 mb-8">
        {/* Current Plan Status */}
        <div className="bg-gradient-to-br from-[#B38B3F]/20 to-black border border-[#B38B3F]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Current Plan Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Current Plan</span>
              <span className="text-white">Business Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Price</span>
              <span className="text-white">$29/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Billing Period</span>
              <span className="text-white">Monthly</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Next Payment</span>
              <span className="text-white">April 15, 2025</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Payment Method</span>
              <span className="text-white">•••• 4242</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Ads</span>
              <span className="text-emerald-400">Enabled</span>
            </div>
          </div>
        </div>

        {/* Plan Benefits */}
        <div className="bg-gradient-to-br from-[#B38B3F]/20 to-black border border-[#B38B3F]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Monthly Usage</h3>
          <p className="text-[#FFD700] text-sm mb-4">Upgrade for unlimited - see plans below</p>
          <div className="space-y-2">
            <div className="space-y-4">
              <div>
                {[
                  { label: 'CRM Contacts', current: 100, total: 5000 },
                  { label: 'SMS Sent', current: 100, total: 15000 },
                  { label: 'Flows', current: 30, total: 500, suffix: 'Tasks' },
                  { label: 'Landing Page', current: 1, total: 1 },
                  { label: 'Websites', current: 1, total: 1 },
                  { label: 'Funnels', current: 1, total: 1 },
                  { label: 'Email Marketing Sends', current: 35, total: 1000 },
                  { label: 'Audience Contacts', current: 300, total: 5000 },
                  { label: 'Power Dialer Calls', current: 120, total: 1000 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">{item.label}</span>
                      <span className="text-white/70 text-sm">
                        {item.current} of {item.total}{item.suffix ? ` ${item.suffix}` : ''}
                      </span>
                    </div>
                    <div className="h-2 bg-[#B38B3F]/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] rounded-full transition-all duration-500"
                        style={{ width: `${(item.current / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Choose your plan</h2>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-6 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] overflow-hidden group flex flex-col h-[380px] ${
              plan.current
                ? 'bg-gradient-to-br from-[#B38B3F]/30 to-black border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                : 'bg-gradient-to-br from-[#B38B3F]/20 to-black border-[#B38B3F]/30 hover:border-[#FFD700] hover:shadow-[0_0_40px_rgba(255,215,0,0.15)]'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-[64px] group-hover:bg-[#FFD700]/20 transition-colors duration-500" />
            <div className="absolute right-12 bottom-12 w-24 h-24 bg-[#B38B3F]/20 rounded-full blur-[32px] group-hover:bg-[#B38B3F]/30 transition-colors duration-500" />
            {plan.current && (
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-xl animate-pulse"></div>
            )}
            {plan.current && (
              <div className="absolute right-10 bottom-10 w-16 h-16 bg-[#B38B3F]/20 rounded-full blur-lg animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/5 to-[#B38B3F]/0 animate-[glow_3s_ease-in-out_infinite]"></div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                <div className="text-xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] bg-clip-text text-transparent">{plan.price}</div>
              </div>
              {plan.current && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#B38B3F]/30 via-[#FFD700]/30 to-[#B38B3F]/30 text-[#FFD700] text-xs font-bold shadow-[0_0_15px_rgba(255,215,0,0.15)] animate-pulse">
                  Your Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-2 flex-1">
              {plan.features.slice(0, 5).map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center mr-2 flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FFD700]" />
                  </div>
                  <span className="text-white/80 text-xs">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={plan.current}
              onClick={() => !plan.current && onUpgrade(plan)}
              className={`w-full py-3 px-4 mt-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center relative overflow-hidden group/btn ${
                plan.current
                  ? 'bg-gradient-to-r from-[#B38B3F]/30 to-[#FFD700]/20 text-[#FFD700] cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                  : 'bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transform hover:scale-[1.02] bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/30 to-[#B38B3F]/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              <span>{plan.current ? 'Current' : 'Upgrade'}</span>
              {!plan.current && <ArrowRight className="w-4 h-4 ml-2" />} 
            </button>
          </div>
        ))}
        
        {/* Cancel Subscription Section */}
        <div className="col-span-3 mt-4 text-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
          >
            Cancel subscription
          </button>
        </div>
      </div>
    </div>
  );
}