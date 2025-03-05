import React from 'react';
import { CreditCard, Receipt, Wallet } from 'lucide-react';

interface BillingTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function BillingTabs({ currentTab, setCurrentTab }: BillingTabsProps) {
  const tabs = [
    { id: 'plans', label: 'Subscription Plan', icon: CreditCard },
    { id: 'payment', label: 'Payment Method', icon: Wallet },
    { id: 'invoices', label: 'Invoices', icon: Receipt }
  ];

  return (
    <div className="flex items-center space-x-1 border-b border-[#B38B3F]/20">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            currentTab === tab.id
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}