import React from 'react';
import { Users, UserCheck, Star, CreditCard, Shield, Tv, DollarSign } from 'lucide-react';

interface UserStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}

function UserStatCard({ title, value, icon, highlight = false }: UserStatCardProps) {
  return (
    <div className={`
      bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl p-4 
      transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5
      ${highlight ? 'relative overflow-hidden' : ''}
    `}>
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 animate-pulse" />
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/50 font-medium">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${highlight ? 'text-[#FFD700]' : 'text-white'}`}>{value}</h3>
        </div>
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center border border-[#B38B3F]/20
          ${highlight ? 'bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 animate-pulse' : 'bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5'}
        `}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface UserStatsProps {
  totalUsers: number;
  adminUsers: number;
  adsDisabledUsers: number;
  subUserCount: number;
  monthlyRevenue: number;
}

export function UserStats({ totalUsers, adminUsers, adsDisabledUsers, subUserCount, monthlyRevenue }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <UserStatCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="w-5 h-5 text-[#FFD700]" />}
      />
      <UserStatCard
        title="Ads Disabled"
        value={adsDisabledUsers}
        icon={<Tv className="w-5 h-5 text-[#FFD700]" />}
      />
      <UserStatCard
        title="Sub Users"
        value={subUserCount}
        icon={<UserCheck className="w-5 h-5 text-[#FFD700]" />}
      />
      <UserStatCard
        title="Monthly Revenue"
        value={monthlyRevenue}
        icon={<DollarSign className="w-5 h-5 text-[#FFD700]" />}
        highlight
        isRevenue
      />
      <UserStatCard
        title="Admin Users"
        value={adminUsers}
        icon={<Shield className="w-5 h-5 text-[#FFD700]" />}
        highlight
      />
    </div>
  );
}