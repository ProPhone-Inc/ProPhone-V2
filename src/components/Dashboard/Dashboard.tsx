import React, { useState, Suspense } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCopilot } from '../../hooks/useCopilot';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import Header from './Header';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { MarketingCard } from './MarketingCard';
import { CampaignOverview } from './CampaignOverview';
import { StatusTracking } from './StatusTracking';
import { TopContacts } from './TopContacts';
import { UpcomingTasks } from './UpcomingTasks';
import CopilotBubble from './CopilotBubble';
import { ErrorBoundary } from '../ErrorBoundary';
import { PhoneSystem } from '../Phone/PhoneSystem';
import { TeamPanelModal } from './TeamPanel/components/TeamPanelModal';
import { CopilotPage } from './CopilotPage';
import { CRMDashboard } from '../CRM/CRMDashboard';
import { AdminPanel } from './AdminPanel';

const ComponentLoader = () => (
  <div className="animate-pulse bg-zinc-800/50 rounded-xl h-full min-h-[200px]" />
);

const canAccessTeamPanel = (user: any) => {
  return user?.role === 'owner' ||
         user?.role === 'super_admin' ||
         user?.role === 'executive' ||
         user?.plan === 'enterprise' ||
         user?.plan === 'god_mode';
};

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AdminModal({ isOpen, onClose }: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-7xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">Super Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const { provider, apiKey } = useCopilot();
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  const [activePage, setActivePage] = useState('dashboard');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotExpanded, setCopilotExpanded] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  
  const [messages, setMessages] = useState<Array<{
    id: string;
    chatId: string;
    type: 'email' | 'sms' | 'call';
    title: string;
    content: string;
    time: string;
    read: boolean;
    sender: {
      name: string;
      avatar?: string;
    };
  }>>([
    {
      id: '1',
      chatId: '1',
      type: 'sms',
      title: 'New Message',
      content: 'Looking forward to our meeting tomorrow at 2 PM',
      time: '10 mins ago',
      read: false,
      sender: {
        name: 'Emily Parker',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    },
    {
      id: '2',
      chatId: '2',
      type: 'sms',
      title: 'New Message',
      content: 'Reaching out about your investment property',
      time: '1 hour ago',
      read: false,
      sender: {
        name: 'Kevin Brown',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    },
    {
      id: '3',
      chatId: '3',
      type: 'sms',
      title: 'New Message',
      content: 'Yes, I can meet tomorrow at 2 PM',
      time: '2 hours ago',
      read: false,
      sender: {
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      }
    },
    {
      id: '4',
      chatId: '1',
      type: 'email',
      title: 'Property Inquiry',
      content: 'Requesting more information about the downtown listings',
      time: '3 hours ago',
      read: false,
      sender: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    },
    {
      id: '5',
      chatId: '2',
      type: 'sms',
      title: 'Appointment Confirmation',
      content: 'Looking forward to our meeting at 3 PM',
      time: '4 hours ago',
      read: false,
      sender: {
        name: 'Mike Chen',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    },
    {
      id: '6',
      chatId: '3',
      type: 'call',
      title: 'Voicemail',
      content: 'New voicemail message (1:23)',
      time: '5 hours ago',
      read: false,
      sender: {
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      }
    },
    {
      id: '7',
      chatId: '1',
      type: 'sms',
      title: 'Schedule Update',
      content: 'Can we move the showing to 4 PM?',
      time: '6 hours ago',
      read: false,
      sender: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    }
  ]);
  
  const handleSidebarClick = (page: string) => {
    // Handle copilot
    if (page === 'copilot') {
      setCopilotExpanded(!copilotExpanded);
      return;
    }
    
    // Handle admin panel access
    if (page === 'admin') {
      if (user?.role === 'owner' || user?.role === 'super_admin') {
        setShowAdminModal(true);
      }
      return;
    }
    
    // Handle team panel access
    if (page === 'team') {
      if (canAccessTeamPanel(user)) {
        setShowTeamPanel(true);
      }
      return;
    }
    
    // Handle regular page navigation
    setActivePage(page);
  };

  // Handle navigation with message selection
  const handlePageChange = (page: string, chatId?: string, messageId?: string) => {
    if (page === 'phone' && messageId) {
      setSelectedMessage(messageId);
      setSelectedChat(chatId || null);
      setActivePage('phone');
      
      // Mark message as read and update unread count
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        );
        return updatedMessages;
      });
    } else {
      setSelectedMessage(null);
      setActivePage(page);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        {/* Admin Modal */}
        {(user?.role === 'owner' || user?.role === 'super_admin') && showAdminModal && (
          <AdminModal 
            isOpen={showAdminModal}
            onClose={() => setShowAdminModal(false)} 
          />
        )}
        
        {/* Team Panel Modal */}
        {showTeamPanel && canAccessTeamPanel(user) && (
          <TeamPanelModal
            isOpen={showTeamPanel}
            onClose={() => setShowTeamPanel(false)}
          />
        )}
        
        {/* Sidebar */}
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activePage={activePage}
          onPageChange={handleSidebarClick}
        />
        
        <div className="flex-1 flex flex-col min-h-screen ml-16">
          <Header 
            user={user} 
            onLogout={logout} 
            collapsed={collapsed}
            activePage={activePage}
            messages={messages}
            onPageChange={handlePageChange}
          />
          
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-zinc-900">
            <div className={`${activePage === 'phone' ? 'h-[calc(100vh-4rem)]' : 'max-w-7xl mx-auto p-4 md:p-6'} w-full`}>
              <>
                {activePage === 'dashboard' && (
                  <div>
                    <StatsCards />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                      <div className="lg:col-span-2 space-y-6">
                        <CampaignOverview />
                        <StatusTracking />
                        <RecentActivity />
                      </div>
                      
                      <div className="space-y-6">
                        <MarketingCard />
                        <TopContacts />
                        <UpcomingTasks />
                      </div>
                    </div>
                  </div>
                )}
                {copilotExpanded && (
                  <ErrorBoundary>
                    <Suspense fallback={<ComponentLoader />}>
                      <CopilotPage 
                        isOpen={copilotExpanded} 
                        onClose={() => setCopilotExpanded(false)} 
                        isSetupMode={!provider || !apiKey}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
                {activePage === 'crm' && (
                  <ErrorBoundary>
                    <Suspense fallback={<ComponentLoader />}>
                      <CRMDashboard
                        activeView="kanban"
                        onViewChange={(view) => console.log('View changed:', view)}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
                {activePage === 'phone' && (
                  <ErrorBoundary>
                    <Suspense fallback={<ComponentLoader />}>
                      <PhoneSystem 
                        selectedMessage={selectedMessage}
                        selectedChat={selectedChat}
                        onMessageSelect={setSelectedMessage}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
                {activePage === 'crm' && (
                  <ErrorBoundary>
                    <Suspense fallback={<ComponentLoader />}>
                      <CRMDashboard
                        activeView="kanban"
                        onViewChange={(view) => console.log('View changed:', view)}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
                {activePage === 'phone' && (
                  <ErrorBoundary>
                    <Suspense fallback={<ComponentLoader />}>
                      <PhoneSystem 
                        selectedMessage={selectedMessage}
                        selectedChat={selectedChat}
                        onMessageSelect={setSelectedMessage}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
              </>
            </div>
          </main>
        </div>
      </div>
      <CopilotBubble />
    </div>
  );
}