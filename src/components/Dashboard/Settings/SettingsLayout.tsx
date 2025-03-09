import React, { useEffect } from 'react';
import { X, User, CreditCard, Bot } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { User as UserModel } from '../../../db';
import { ProfileSection } from './ProfileSection'; 
import { BillingSection } from './BillingSection'; 
import { CopilotSection } from './CopilotSection'; 

interface SettingsLayoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsLayout({ isOpen, onClose }: SettingsLayoutProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData] = React.useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.email) {
        const data = await UserModel.findOne({ email: user.email });
        setUserData(data);
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [user]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[1400px] h-[800px] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <User className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-white/60">Manage your account preferences and settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 h-[calc(800px-81px)] overflow-y-auto">
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-black/60 backdrop-blur-md border border-[#B38B3F]/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                  <User className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                  <p className="text-white/60 text-sm">Manage your personal information</p>
                </div>
              </div>
              <ProfileSection userData={userData} setUserData={setUserData} />
            </div>
            
            {/* Billing Section */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-black/60 backdrop-blur-md border border-[#B38B3F]/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                  <CreditCard className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Subscription & Billing</h2>
                  <p className="text-white/60 text-sm">Manage your subscription and payments</p>
                </div>
              </div>
              <BillingSection userData={userData} />
            </div>
            
            {/* Copilot Section */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-black/60 backdrop-blur-md border border-[#B38B3F]/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                  <Bot className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">CoPilot Settings</h2>
                  <p className="text-white/60 text-sm">Configure your AI assistant</p>
                </div>
              </div>
              <CopilotSection userData={userData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}