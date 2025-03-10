import React from 'react';
import { Phone, MessageSquare, Users, Settings } from 'lucide-react';

interface NavigationMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationMenu({ activeTab, onTabChange }: NavigationMenuProps) {
  const menuItems = [
    { id: 'phone', icon: Phone },
    { id: 'messages', icon: MessageSquare },
    { id: 'contacts', icon: Users },
    { id: 'settings', icon: Settings }
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-16 bg-zinc-900 border-r border-[#B38B3F]/20 flex flex-col items-center py-4 space-y-4">
      {menuItems.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            activeTab === id
              ? 'bg-[#B38B3F]/20 text-[#FFD700]'
              : 'hover:bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}