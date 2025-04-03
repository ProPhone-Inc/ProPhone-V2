import React from 'react';
import { TotalSMSSentCard } from './TotalSMSSentCard';
import { TotalCallsCard } from './TotalCallsCard';
import { UnreadMessagesCard } from './UnreadMessagesCard';
import { MissedCallsCard } from './MissedCallsCard';

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TotalSMSSentCard />
      <TotalCallsCard />
      <UnreadMessagesCard />
      <MissedCallsCard />
    </div>
  );
}