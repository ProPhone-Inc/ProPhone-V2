import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Phone,
  ListChecks,
  Sparkles,
  Megaphone, 
  Rocket,
  MessageSquare,
  GitMerge,
  FileText,
  Users,
  UserCog,
  Settings, 
  Shield,
  History, 
  BarChart2,
  FileStack,
  FileSignature,
  FileSpreadsheet,
  UserSquare2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const defaultItems = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: <Home size={20} />
  },
  {
    id: 'phone',
    text: 'Phone System',
    icon: <Phone size={20} />
  },
  {
    id: 'proflow',
    text: 'ProFlow Automation',
    icon: <GitMerge size={20} />
  },
  {
    id: 'docupro',
    text: 'DocuPro',
    icon: <FileText size={20} />
  },
  {
    id: 'crm',
    text: 'CRM',
    icon: <Users size={20} />
  }
];

const crmItems = [
  {
    id: 'crm-home',
    text: 'Home',
    icon: <Home size={20} />
  },
  {
    id: 'crm-contacts',
    text: 'Contacts',
    icon: <Users size={20} />
  },
  {
    id: 'crm-pipelines',
    text: 'Pipeline',
    icon: <FileText size={20} />
  },
  {
    id: 'crm-lists',
    text: 'My Lists',
    icon: <ListChecks size={20} />
  }
];

const phoneSystemItems = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: <Home size={20} />
  },
  {
    id: 'phone',
    text: 'Phone',
    icon: <Phone size={20} />
  },
  {
    id: 'call-logs',
    text: 'Call Logs',
    icon: <History size={20} />
  },
  {
    id: 'sms-campaign',
    text: 'SMS Campaign',
    icon: <MessageSquare size={20} />
  },
  {
    id: 'power-dialer',
    text: 'Power Dialer',
    icon: <Rocket size={20} />
  }
];

const docuProItems = [
  {
    id: 'docupro-home',
    text: 'Home',
    icon: <Home size={20} />
  },
  {
    id: 'docupro-transactions',
    text: 'Transactions',
    icon: <FileStack size={20} />
  },
  {
    id: 'docupro-templates',
    text: 'Templates',
    icon: <FileSignature size={20} />
  },
  {
    id: 'docupro-reporting',
    text: 'Reporting',
    icon: <FileSpreadsheet size={20} />
  },
  {
    id: 'docupro-people',
    text: 'People',
    icon: <UserSquare2 size={20} />
  }
];

const canAccessTeamPanel = (user: any) => {
  return user?.role === 'owner' ||
         user?.role === 'super_admin' ||
         user?.role === 'executive' ||
         user?.plan === 'elite' ||
         user?.plan === 'god_mode';
};

const canAccessAdminPanel = (user: any) => {
  return user?.role === 'owner' || user?.role === 'super_admin';
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activePage: string;
  onPageChange: (page: string) => void;
  token?: string;
  setCopilotExpanded?: (expanded: boolean) => void;
  setShowCallLogs?: (show: boolean) => void;
  setShowAdminModal?: (show: boolean) => void;
  setShowReportingModal?: (show: boolean) => void;
  setShowTeamPanel?: (show: boolean) => void;
}

interface SidebarState {
  showSubmenu: boolean;
  isExpanded: boolean;
  activeSubmenu: string | null;
  showSubItems: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  id: string;
  highlight?: boolean;
  active?: boolean;
  collapsed: boolean;
  onClick?: (subItemId?: string) => void;
  isAdmin?: boolean;
}

function SidebarItem({ 
  icon, 
  text, 
  id, 
  active = false, 
  highlight = false,
  collapsed, 
  onClick, 
  isAdmin = false,
}: SidebarItemProps) {
  const itemRef = React.useRef<HTMLLIElement>(null);

  return (
    <li 
      ref={itemRef}
      className="relative"
    >
      <a 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          if (onClick) {
            onClick();
          }
        }}
        className={`
          flex items-center py-3 rounded-xl transition-all duration-200
          ${collapsed ? 'justify-center mx-auto w-10 h-10' : 'px-4 justify-start'} 
          ${active 
            ? 'bg-gradient-to-r from-[#B38B3F]/30 to-[#FFD700]/10 text-[#FFD700] border border-[#B38B3F]/40'
            : highlight
              ? 'bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/5 text-[#FFD700] border border-[#B38B3F]/30'
              : 'hover:bg-white/5 text-white/70 hover:text-white'}
          ${isAdmin ? 'relative' : ''}
          relative
        `}
      >
        <div className={`flex items-center justify-center ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`}>
          {icon}
        </div>
        {!collapsed && (
          <span className="ml-3 whitespace-nowrap transition-opacity duration-300">
            {text}
          </span>
        )}
        {highlight && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 animate-pulse rounded-xl" />
        )}
        {highlight && active && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 animate-pulse rounded-xl" />
        )}
      </a>
    </li>
  );
}

export function Sidebar({ 
  collapsed: propCollapsed, 
  setCollapsed, 
  activePage, 
  onPageChange,
  token,
  setCopilotExpanded,
  setShowCallLogs,
  setShowAdminModal,
  setShowReportingModal,
  setShowTeamPanel
}: SidebarProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(propCollapsed);
  const [sidebarState, setSidebarState] = React.useState<SidebarState>({
    showSubmenu: false,
    isExpanded: false,
    activeSubmenu: null,
    showSubItems: false
  });
  
  // Determine which items to show based on active page
  const sidebarItems = ['phone', 'call-logs', 'sms-campaign', 'power-dialer'].includes(activePage) 
    ? phoneSystemItems 
    : activePage.startsWith('docupro-') || activePage === 'docupro' 
        ? docuProItems
        : activePage.startsWith('crm-') || activePage === 'crm'
          ? crmItems
          : defaultItems;

  // Keep track of previous page for phone system navigation
  const prevPage = React.useRef(activePage);

  React.useEffect(() => {
    // Store previous page when changing pages
    prevPage.current = activePage;
  }, [activePage]);

  // Track if we should auto-open submenu
  const shouldAutoOpen = React.useRef(false);

  // Sync with parent state
  useEffect(() => {
    setInternalCollapsed(propCollapsed);
  }, [propCollapsed]);

  // When hover state changes, update parent if needed
  useEffect(() => {
    if (isHovered && internalCollapsed) {
      // Check if current page is a submenu item
      const activeParent = sidebarItems.find(item => 
        item.subItems?.some(sub => sub.id === activePage)
      );
      if (activeParent) {
        setSidebarState({
          showSubmenu: true,
          isExpanded: true,
          activeSubmenu: activeParent.text,
          showSubItems: true
        });
      }
      shouldAutoOpen.current = true;
    } else if (!isHovered && !internalCollapsed && propCollapsed) {
      // Return to collapsed state when un-hovering if parent wants collapsed
      setInternalCollapsed(true);
      setSidebarState({
        showSubmenu: false,
        isExpanded: false,
        activeSubmenu: null,
        showSubItems: false
      });
      shouldAutoOpen.current = false;
    }
  }, [isHovered, internalCollapsed, propCollapsed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Check if current page is a submenu item
    const activeParent = sidebarItems.find(item => 
      item.subItems?.some(sub => sub.id === activePage)
    );
    if (activeParent) {
      setSidebarState({
        showSubmenu: true,
        isExpanded: true,
        activeSubmenu: activeParent.text,
        showSubItems: true
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    shouldAutoOpen.current = false;
    if (propCollapsed) {
      setSidebarState({
        showSubmenu: false,
        isExpanded: false,
        activeSubmenu: null,
        showSubItems: false
      });
    }
  };

  // Calculate effective collapsed state (collapsed unless hovered)
  const effectiveCollapsed = internalCollapsed && !isHovered;

  const handleSidebarClick = (page: string) => {
    // Handle CRM navigation
    if (page === 'crm') {
      onPageChange('crm-contacts');
      return;
    }

    // Handle CRM home navigation (return to dashboard)
    if (page === 'crm-home') {
      onPageChange('dashboard');
      return;
    }

    // Keep phone system menu for phone-related pages
    if (['phone', 'call-logs', 'sms-campaign', 'power-dialer'].includes(activePage) && 
        ['phone', 'call-logs', 'sms-campaign', 'power-dialer'].includes(page)) {
      onPageChange(page);
      return;
    }

    // Handle DocuPro home navigation
    if (page === 'docupro-home') {
      onPageChange('dashboard');
      return;
    }

    // Handle ProFlow navigation
    if (page === 'proflow' && token) {
      window.location.href = `https://flow.prophone.io/sign-in/?token=${token}`;
      return;
    }
    
    // Handle DocuPro navigation
    if (page === 'docupro') {
      onPageChange('docupro-transactions');
      return;
    }

    // Handle copilot
    if (page === 'copilot') {
      if (setCopilotExpanded) {
        setCopilotExpanded(prev => !prev);
      }
      return;
    }
    
    // Handle call logs
    if (page === 'call-logs') {
      if (setShowCallLogs) {
        setShowCallLogs(true);
      }
      onPageChange('call-logs');
      return;
    }
    
    // Handle admin panel access
    if (page === 'admin') {
      if (user?.role === 'owner' || user?.role === 'super_admin') {
        if (setShowAdminModal) {
          setShowAdminModal(true);
        }
        return;
      }
    }
    
    // Handle reporting panel access
    if (page === 'reporting') {
      if (user?.role === 'owner' || user?.role === 'super_admin') {
        if (setShowReportingModal) {
          setShowReportingModal(true);
        }
        return;
      }
      return;
    }
    
    // Handle team panel access
    if (page === 'team') {
      if (canAccessTeamPanel(user)) {
        if (setShowTeamPanel) {
          setShowTeamPanel(true);
        }
      }
      return;
    }
    
    // Call the parent's onPageChange handler
    onPageChange(page);
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-screen z-[100] bg-gradient-to-b from-zinc-900 to-black border-r border-[#B38B3F]/20 flex flex-col transition-all duration-300 ease-in-out shadow-xl shadow-black/20 ${effectiveCollapsed ? 'w-16' : 'w-64'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-16 flex items-center p-4 border-b border-[#B38B3F]/20">
        <div className={`transition-all duration-300 ${effectiveCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'}`}>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
            ProPhone
          </div>
        </div>
        <div className={`transition-all duration-300 ${!effectiveCollapsed ? 'opacity-0 scale-0 absolute' : 'opacity-100 scale-100 mx-auto'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] flex items-center justify-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-4 px-3 overflow-y-auto scrollbar-hide">
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={React.cloneElement(item.icon as React.ReactElement, { 
                  size: effectiveCollapsed ? 18 : 20 
                })}
                text={item.text}
                id={item.id}
                active={activePage === item.id}
                collapsed={effectiveCollapsed}
                onClick={() => handleSidebarClick(item.id)}
              />
            ))}
          </ul>
          
          <div className="mt-6 pt-6 border-t border-[#B38B3F]/20">
            <ul className="space-y-2">
              {/* Copilot */}
              <SidebarItem
                icon={<Sparkles size={effectiveCollapsed ? 18 : 20} className="text-[#FFD700]" />}
                text="Copilot"
                id="copilot"
                collapsed={effectiveCollapsed}
                onClick={() => handleSidebarClick('copilot')}
              />
              {/* Team Panel */}
              {canAccessTeamPanel(user) && (
                <SidebarItem 
                  icon={<UserCog size={effectiveCollapsed ? 18 : 20} className="text-[#FFD700]" />} 
                  text="Team Panel" 
                  id="team"
                  active={activePage === 'team'} 
                  collapsed={effectiveCollapsed}
                  onClick={() => handleSidebarClick('team')}
                />
              )}
              
              {/* Admin section */}
              {canAccessAdminPanel(user) && (
                <>
                  <SidebarItem 
                    icon={<Shield size={effectiveCollapsed ? 18 : 20} className="text-[#FFD700]" />} 
                    text="Super Admin Panel" 
                    id="admin"
                    active={activePage === 'admin'} 
                    collapsed={effectiveCollapsed} 
                    onClick={() => handleSidebarClick('admin')}
                    isAdmin
                  />
                  <SidebarItem 
                    icon={<BarChart2 size={effectiveCollapsed ? 18 : 20} className="text-[#FFD700]" />} 
                    text="System Processing" 
                    id="reports"
                    active={activePage === 'reports'} 
                    collapsed={effectiveCollapsed} 
                    onClick={() => handleSidebarClick('reporting')}
                    isAdmin
                  />
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}