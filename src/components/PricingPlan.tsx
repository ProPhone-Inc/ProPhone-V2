import React from 'react';
import { Check } from 'lucide-react';

interface PricingPlanProps {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function PricingPlan({
  id,
  name,
  price,
  description,
  features,
  icon,
  popular,
  selected,
  onSelect
}: PricingPlanProps) {
  return (
    <div
      className={`relative p-8 rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer
        ${selected
          ? 'bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border-[#FFD700] shadow-xl shadow-[#B38B3F]/20'
          : 'bg-black/40 border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/10'
        }
      `}
      onClick={() => onSelect(id)}
    >
      {popular && (
        <div className="absolute -top-4 -right-4">
          <div className="bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            Popular
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-3xl font-bold text-[#FFD700]">{price}</span>
            {price !== 'Free' && (
              <span className="text-white/50 ml-1">/month</span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
          {icon}
        </div>
      </div>

      <p className="text-white/70 text-sm mb-6">{description}</p>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <div className="w-5 h-5 rounded-full bg-[#FFD700]/10 flex items-center justify-center mr-3 flex-shrink-0">
              <Check className="w-3 h-3 text-[#FFD700]" />
            </div>
            <span className="text-white/90">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300
          ${selected
            ? 'bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black hover:shadow-lg'
            : 'bg-white/10 text-white hover:bg-white/20'
          }
        `}
        onClick={() => onSelect(id)}
      >
        {selected ? 'Complete Signup' : 'Select Plan'}
      </button>
    </div>
  );
}