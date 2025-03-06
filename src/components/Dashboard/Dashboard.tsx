import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../db';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { MarketingCard } from './MarketingCard';
import { CampaignOverview } from './CampaignOverview';
import { StatusTracking } from './StatusTracking';
import { TopContacts } from './TopContacts';
import { UpcomingTasks } from './UpcomingTasks';
import { TeamPanelModal } from './TeamPanel/components/TeamPanelModal';
import { AdminPanel } from './AdminPanel';
import { CopilotBubble } from './CopilotBubble';
// Helper function to check if user can access team panel
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
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  const [activePage, setActivePage] = useState('dashboard');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  
  const handleSidebarClick = (page: string) => {
    // Prevent access to team panel for regular members
    if (page === 'team' && !canAccessTeamPanel(user)) {
      return;
    }
    
    if (page === 'admin' && (user?.role === 'owner' || user?.role === 'super_admin')) {
      setShowAdminModal(true);
    } else if (page === 'team') {
      setShowTeamPanel(true);
    } else {
      setActivePage(page);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Modal */}
      {(user?.role === 'owner' || user?.role === 'super_admin') && (
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
      
      <div className="ml-16 flex flex-col min-h-screen w-auto">
        <Header 
          user={user} 
          onLogout={logout} 
          collapsed={collapsed} 
          onPageChange={handleSidebarClick}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-black to-zinc-900">
          <div className="max-w-7xl mx-auto">
            <>
              {activePage !== 'team' && (
                <>
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
                </>
              )}
            </>
          </div>
        </main>
      </div>
      <CopilotBubble />
    </div>
  );
}