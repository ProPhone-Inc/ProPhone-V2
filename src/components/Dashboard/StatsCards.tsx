import React from 'react';
import { MessageSquareText, Phone, MessageSquare, PhoneOff } from 'lucide-react';

interface StatCardProps { 
  title: string;
  value: string;
  change: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode; 
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl p-6 transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/50 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
          <div className={`flex items-center mt-2 ${change.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {change.positive ? (
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            <span className="text-sm font-medium">{change.value}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: 'Total SMS Sent',
      value: '24,951',
      change: {
        value: '8.2% this month',
        positive: true,
      },
      icon: <MessageSquareText className="w-6 h-6 text-[#FFD700]" />,
    },
    {
      title: 'Total Calls',
      value: '12,845',
      change: {
        value: '6.8% this month',
        positive: true,
      },
      icon: <Phone className="w-6 h-6 text-[#FFD700]" />,
    },
    {
      title: 'Unread Messages',
      value: '1,245',
      change: {
        value: '3.2% this week',
        positive: false,
      },
      icon: <MessageSquare className="w-6 h-6 text-[#FFD700]" />,
    },
    {
      title: 'Missed Calls',
      value: '89',
      change: {
        value: '5.3% this month',
        positive: false,
      },
      icon: <PhoneOff className="w-6 h-6 text-[#FFD700]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          {...stat} 
        />
      ))}
    </div>
  );
}