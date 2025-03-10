import React from 'react';
import { CreditCard, Check, ArrowRight } from 'lucide-react';

interface SubscriptionSectionProps {
  activeSection: string;
  userData: any;
}

export function SubscriptionSection({ activeSection, userData }: SubscriptionSectionProps) {
  if (activeSection !== 'subscription') return null;

  const plans = [
    {
      name: 'Business Starter',
      price: 'Free',
      features: [
        'Basic Marketing Tools',
        'Up to 100 Contacts',
        'Email Support',
        'Basic Analytics',
        'Standard Templates'
      ],
      current: userData?.plan === 'starter'
    },
    {
      name: 'Business Pro',
      price: '$29',
      features: [
        'Advanced Marketing Tools',
        'Up to 2500 Contacts',
        'Priority Support',
        'Advanced Analytics',
        'Premium Templates',
        'Custom Branding',
        'API Access'
      ],
      current: userData?.plan === 'pro'
    },
    {
      name: 'Business Elite',
      price: '$99',
      features: [
        'Enterprise Marketing Suite',
        'Unlimited Contacts',
        '24/7 Dedicated Support',
        'Custom Analytics',
        'Custom Templates',
        'White Labeling',
        'API Access',
        'Custom Integrations',
        'Dedicated Account Manager'
      ],
      current: userData?.plan === 'enterprise'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Subscription Plan</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-6 rounded-xl border transition-all duration-300 ${
              plan.current
                ? 'bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border-[#FFD700] shadow-xl shadow-[#B38B3F]/20'
                : 'bg-zinc-800/50 border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="text-2xl font-bold text-[#FFD700] mt-1">{plan.price}</div>
              </div>
              {plan.current && (
                <span className="px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-sm font-medium">
                  Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-[#FFD700] mr-2 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={plan.current}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                plan.current
                  ? 'bg-[#FFD700]/20 text-[#FFD700] cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span>{plan.current ? 'Current Plan' : 'Upgrade'}</span>
              {!plan.current && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}