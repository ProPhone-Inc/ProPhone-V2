import React from 'react';
import { X, User, Bot, CreditCard } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useDB } from '../../../hooks/useDB';
import { db } from '../../../db';
import { ProfileSection } from './ProfileSection';
import { BillingSection } from './BillingSection';
import { CopilotSection } from './CopilotSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Section = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  adminOnly?: boolean;
  beta?: boolean;
};

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const { isLoading } = useDB();
  const [activeSection, setActiveSection] = React.useState(() => {
    const savedSection = localStorage.getItem('settingsSection');
    return savedSection || 'profile';
  });
  const [isNavExpanded, setIsNavExpanded] = React.useState(false);
  const [userData, setUserData] = React.useState<any>(null);
  const navRef = React.useRef<HTMLDivElement>(null);

  const sections: Section[] = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage your personal information',
      icon: <User className="w-5 h-5" />,
      component: <ProfileSection userData={userData} setUserData={setUserData} />
    },
    {
      id: 'billing',
      label: 'Subscription & Billing',
      description: 'Manage your subscription and payments',
      icon: <CreditCard className="w-5 h-5" />,
      component: <BillingSection userData={userData} />
    },
    {
      id: 'copilot',
      label: 'CoPilot Settings',
      description: 'Configure your AI assistant',
      icon: <Bot className="w-5 h-5" />,
      component: <CopilotSection userData={userData} />,
      adminOnly: true
    }
  ];

  React.useEffect(() => {
    const loadUserData = async () => {
      if (user?.email) {
        const data = await db.getUserByEmail(user.email);
        setUserData(data);
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

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-container">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              {currentSection?.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{currentSection?.label || 'Settings'}</h1>
              <p className="text-white/60">{currentSection?.description || 'Manage your account preferences'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8 p-6 h-[calc(800px-81px)] overflow-y-auto">
          {/* Navigation */}
          <div 
            ref={navRef}
            className={`col-span-${isNavExpanded ? '3' : '1'} transition-all duration-300 ease-in-out`}
            onMouseEnter={() => setIsNavExpanded(true)}
            onMouseLeave={() => setIsNavExpanded(false)}
          >
            <nav className="space-y-1">
              {sections.map((section) => {
                if (section.adminOnly && user?.role !== 'owner') return null;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      localStorage.setItem('settingsSection', section.id);
                    }}
                    className={`
                      w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-200
                      ${activeSection === section.id
                        ? 'bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/40 text-[#FFD700]'
                        : 'hover:bg-white/5 text-white/70 hover:text-white'
                      }
                    `}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
                      {section.icon}
                    </div>
                    <div className={`flex-1 text-left transition-opacity duration-300 ${isNavExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                      <div className="flex items-center">
                        <span className="font-medium text-base">{section.label}</span>
                        {section.beta && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-medium">
                            Beta
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/50">{section.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className={`col-span-${isNavExpanded ? '9' : '11'} transition-all duration-300 ease-in-out`}>
            <div className="bg-gradient-to-br from-zinc-900/80 to-black/60 backdrop-blur-md border border-[#B38B3F]/20 rounded-xl p-6">
              {currentSection?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}