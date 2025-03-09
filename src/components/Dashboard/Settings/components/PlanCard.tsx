import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  current: boolean;
  onUpgrade: () => void;
}

export function PlanCard({ name, price, features, current, onUpgrade }: PlanCardProps) {
  return (
    <div
      className={`relative p-6 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] ${
        current
          ? 'bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border-[#FFD700] shadow-xl shadow-[#B38B3F]/20'
          : 'bg-black/40 border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/10'
      }`}
    >
      {current && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 blur-sm animate-pulse" />
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text mt-1">{price}</div>
        </div>
        {current && (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#B38B3F]/20 via-[#FFD700]/20 to-[#B38B3F]/20 text-[#FFD700] text-sm font-medium animate-pulse">
            Your Current Plan
          </span>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-center text-sm">
            <div className="w-5 h-5 rounded-full bg-[#FFD700]/10 flex items-center justify-center mr-3 flex-shrink-0">
              <Check className="w-3 h-3 text-[#FFD700]" />
            </div>
            <span className="text-white/90">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={current}
        onClick={onUpgrade}
        className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
          current
            ? 'bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/10 text-[#FFD700] cursor-not-allowed'
            : 'bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black hover:shadow-lg hover:shadow-[#B38B3F]/20 transform hover:scale-[1.02] bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0]'
        }`}
      >
        <span>{current ? 'Your Current Plan' : 'Upgrade'}</span>
        {!current && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}