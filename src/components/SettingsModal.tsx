import React from 'react';
import { X, User, CreditCard, Globe, ArrowRight, MessageSquare, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProfileSection } from './Dashboard/Settings/sections/ProfileSection';
import { BillingSection } from './Dashboard/Settings/BillingSection';
import { PhoneNumbersSection } from './Dashboard/Settings/sections/PhoneNumbersSection';
import { IntegrationsSection } from './Dashboard/Settings/sections/IntegrationsSection';
import { CalendarSection } from './Dashboard/Settings/sections/CalendarSection';
import { SMSSettings } from './Dashboard/Settings/sections/SMSSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string; 
  setShowTeamPanel?: (show: boolean) => void;
}

export function SettingsModal({ isOpen, onClose, initialSection = 'profile', setShowTeamPanel }: SettingsModalProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = React.useState(() => {
    // Get the section from localStorage or use the initialSection prop
    const savedSection = localStorage.getItem('settingsSection');
    return savedSection || initialSection;
  });

  if (!isOpen) return null;

  const sections = [
    {
      id: 'profile',
      label: 'Profile Information',
      description: 'Manage your account details and preferences',
      icon: <User className="w-6 h-6" />,
      component: <ProfileSection userData={user} />
    },
    {
      id: 'billing',
      label: 'Subscription & Billing',
      description: 'View and manage your subscription plan',
      icon: <CreditCard className="w-6 h-6" />,
      component: <BillingSection userData={user} />
    },
    {
      id: 'numbers',
      label: 'Phone Numbers',
      description: 'Manage your phone numbers',
      icon: <Phone className="w-6 h-6" />,
      component: <PhoneNumbersSection />
    },
    {
      id: 'integrations',
      label: 'Integrations',
      description: 'Connect and manage your external services',
      icon: <Globe className="w-6 h-6" />,
      component: <IntegrationsSection />
    },
    {
      id: 'calendar',
      label: 'Calendar Settings',
      description: 'Configure calendar preferences and sync',
      icon: <Calendar className="w-6 h-6" />,
      component: <CalendarSection />
    },
    {
      id: 'sms',
      label: 'SMS Settings',
      description: 'Manage SMS preferences and automation',
      icon: <MessageSquare className="w-6 h-6" />,
      component: <SMSSettings />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-[#B38B3F]/30 rounded-2xl shadow-2xl w-full max-w-[1200px] max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
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

        <div className="grid grid-cols-[280px,1fr] h-[calc(85vh-73px)]">
          {/* Navigation */}
          <div className="border-r border-[#B38B3F]/20 p-4">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                    ${activeSection === section.id
                      ? 'bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/40'
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${activeSection === section.id
                        ? 'bg-[#FFD700]/20 border border-[#FFD700]/40'
                        : 'bg-zinc-800 border border-[#B38B3F]/20'
                      }
                    `}>
                      {section.icon}
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${
                        activeSection === section.id ? 'text-[#FFD700]' : 'text-white'
                      }`}>{section.label}</div>
                      <div className="text-sm text-white/50">{section.description}</div>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-colors ${
                    activeSection === section.id ? 'text-[#FFD700]' : 'text-white/20'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto pb-12">
            {activeSection === 'billing' ? (
              <BillingSection 
                userData={user} 
                onClose={onClose} 
                setShowTeamPanel={setShowTeamPanel || (() => {})} 
              />
            ) : (
              sections.find(s => s.id === activeSection && s.id !== 'billing')?.component
            )}
          </div>
        </div>
      </div>
    </div>
  );
}