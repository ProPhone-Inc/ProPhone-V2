import React from 'react';
import { Check, ArrowRight, Zap, Rocket, Crown, Star } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Current Plan Status */}
        <div className="bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/30 rounded-xl p-3 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white mb-1.5">Current Plan Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Current Plan</span>
              <span className="text-white text-sm">Business Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Price</span>
              <span className="text-white text-sm">$29/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Billing Period</span>
              <span className="text-white text-sm">Monthly</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Next Payment</span>
              <span className="text-white text-sm">April 15, 2025</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Ads</span>
              <span className="text-emerald-400 text-sm">Removed</span>
            </div>
          </div>
        </div>

        {/* Monthly Usage Stats */}
        <div className="bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/30 rounded-xl p-3 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white mb-2">Monthly Usage</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'SMS Sent', current: 100, total: 15000 },
              { label: 'Email Sends', current: 35, total: 1000 },
              { label: 'Flow Tasks', current: 30, total: 500 }
            ].map((item) => (
              <div key={item.label} className="group">
                <div className="text-sm text-white/70 mb-2 flex flex-col">
                  <span className="font-medium text-white">{item.label}</span>
                  <span className="text-xs text-white/60">
                    {item.current}/{item.total}
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden transition-all duration-300 group-hover:bg-white/20">
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

      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text mb-8">
        Choose Your Perfect Plan
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {[
          {
            name: 'Starter',
            price: 'Free',
            icon: <Zap className="w-8 h-8" />,
            color: 'from-[#B38B3F]/20 to-[#FFD700]/10',
            borderColor: 'border-[#B38B3F]/30',
            buttonColor: 'from-[#B38B3F] to-[#FFD700]',
            iconColor: 'text-[#FFD700]',
            features: [
              'Basic Marketing Tools',
              'Up to 100 Contacts',
              'Email Support',
              'Basic Analytics',
              'Standard Templates'
            ]
          },
          {
            name: 'Professional',
            price: '$29',
            icon: <Rocket className="w-8 h-8" />,
            color: 'from-[#B38B3F]/20 to-[#FFD700]/10',
            borderColor: 'border-[#B38B3F]/30',
            buttonColor: 'from-[#B38B3F] to-[#FFD700]',
            iconColor: 'text-[#FFD700]',
            popular: true,
            features: [
              'Advanced Marketing Tools',
              'Up to 2500 Contacts',
              'Priority Support',
              'Advanced Analytics',
              'Custom Templates',
              'API Access'
            ]
          },
          {
            name: 'Enterprise',
            price: '$99',
            icon: <Crown className="w-8 h-8" />,
            color: 'from-[#B38B3F]/20 to-[#FFD700]/10',
            borderColor: 'border-[#B38B3F]/30',
            buttonColor: 'from-[#B38B3F] to-[#FFD700]',
            iconColor: 'text-[#FFD700]',
            features: [
              'Enterprise Marketing Suite',
              'Unlimited Contacts',
              '24/7 Dedicated Support',
              'Custom Analytics',
              'White Labeling',
              'API Access',
              'Custom Integrations',
              'Dedicated Account Manager'
            ]
          }
        ].map((plan) => (
          <div
            key={plan.name}
            className={`relative p-8 rounded-2xl border transition-all duration-500 transform hover:scale-[1.02] cursor-pointer overflow-hidden group h-[600px] flex flex-col
              bg-gradient-to-br ${plan.color} backdrop-blur-sm ${plan.borderColor}
              hover:shadow-2xl hover:shadow-${plan.buttonColor.split(' ')[1]}/10`}
          >
            {plan.popular && (
              <div className="absolute -top-4 -right-4">
                <div className={`bg-gradient-to-r ${plan.buttonColor} text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse`}>
                  Most Popular
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className={`text-3xl font-bold ${plan.iconColor} mt-2`}>{plan.price}</div>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center border ${plan.borderColor} group-hover:scale-110 transition-transform duration-500`}>
                <div className={plan.iconColor}>{plan.icon}</div>
              </div>
            </div>

            <ul className="space-y-4 flex-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <div className={`w-5 h-5 rounded-full ${plan.color} flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Check className={`w-3 h-3 ${plan.iconColor}`} />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 px-6 rounded-xl font-medium text-lg transition-all duration-500 relative
                bg-gradient-to-r ${plan.buttonColor} text-white
                hover:shadow-lg hover:shadow-${plan.buttonColor.split(' ')[1]}/20
                transform hover:scale-[1.02] active:scale-[0.98]
                overflow-hidden group/btn`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.buttonColor} opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500`} />
              <span>Choose {plan.name}</span>
              <ArrowRight className="w-5 h-5 inline-block ml-2" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-white/50 mt-12">
        You can change your plan at any time from your account settings
      </p>
    </div>
  );
}