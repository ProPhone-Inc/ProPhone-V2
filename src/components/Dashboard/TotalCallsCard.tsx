import React from 'react';
import { Phone } from 'lucide-react';
import { useCallLogs } from '../../hooks/useCallLogs';
import { useAnalytics } from '../../hooks/useAnalytics';

export function TotalCallsCard() {
  const { logs } = useCallLogs();
  const { callsGrowth, isLoading } = useAnalytics();

  // Calculate total calls across all phone lines
  const totalCalls = logs.length;

  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl p-6 transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/50 font-medium">Total Calls</p>
          <h3 className="text-2xl font-bold mt-1 text-white">
            {isLoading ? (
              <div className="h-8 w-24 bg-white/10 animate-pulse rounded"></div>
            ) : (
              totalCalls.toLocaleString()
            )}
          </h3>
          <div className="flex items-center mt-2 text-emerald-500">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={callsGrowth >= 0 
                ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
            </svg>
            <span className={`text-sm font-medium ${callsGrowth < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {isLoading ? (
                <div className="h-4 w-20 bg-emerald-500/20 animate-pulse rounded"></div>
              ) : (
                `${Math.abs(callsGrowth)}% this month`
              )}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
          <Phone className="w-6 h-6 text-[#FFD700]" />
        </div>
      </div>
    </div>
  );
}