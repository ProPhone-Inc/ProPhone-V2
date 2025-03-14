import React from 'react';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
          <Shield className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Platform User Management</h1>
          <p className="text-white/60">Manage all users across the entire ProPhone platform</p>
        </div>
      </div>
    </div>
  );
}