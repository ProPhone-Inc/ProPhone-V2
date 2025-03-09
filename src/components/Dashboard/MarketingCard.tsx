import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export function MarketingCard() {
  return (
    <div className="relative z-0 bg-gradient-to-br from-[#B38B3F]/30 to-[#FFD700]/10 rounded-xl p-6 overflow-hidden border border-[#B38B3F]/20 transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/10 card-gold-glow">
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-xl"></div>
      <div className="absolute right-10 bottom-10 w-16 h-16 bg-[#B38B3F]/20 rounded-full blur-lg"></div>
      
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] flex items-center justify-center shadow-lg mb-4">
          <Zap className="w-6 h-6 text-black" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Boost Your Campaigns</h3>
        <p className="text-white/70 mb-4">
          Upgrade to Pro and unlock advanced features for your marketing campaigns.
        </p>
        
        <button className="w-full bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transform transition-all duration-500 hover:scale-[1.02] bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] shadow-lg">
          <span>Upgrade Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}