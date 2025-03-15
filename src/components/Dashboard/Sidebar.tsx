import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Phone,
  GitMerge,
  FileText,
  Users,
  UserCog,
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activePage: string;
  onPageChange: (page: string) => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed: boolean;
  onClick?: () => void;
  isAdmin?: boolean;
}

function SidebarItem({ icon, text, active = false, collapsed, onClick, isAdmin = false }: SidebarItemProps) {
  return (
    <li>
      <a 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick();
        }}
        className={`
          flex items-center py-3 rounded-xl transition-all duration-200
          ${collapsed ? 'justify-center mx-auto w-10 h-10' : 'px-4 justify-start'} 
          ${active 
            ? 'bg-gradient-to-r from-[#B38B3F]/30 to-[#FFD700]/10 text-[#FFD700] border border-[#B38B3F]/40' 
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
      </a>
    </li>
  );
}

export function Sidebar({ collapsed: propCollapsed, setCollapsed, activePage, onPageChange }: SidebarProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(propCollapsed);
  const [token, setToken] = useState("");


  // Sync with parent state
  useEffect(() => {
    setInternalCollapsed(propCollapsed);
  }, [propCollapsed]);

  // When hover state changes, update parent if needed
  useEffect(() => {
    if (isHovered && internalCollapsed) {
      // Don't update parent state, just manage hover expansion internally
    } else if (!isHovered && !internalCollapsed && propCollapsed) {
      // Return to collapsed state when un-hovering if parent wants collapsed
      setInternalCollapsed(true);
    }
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        const parsedUser = JSON.parse(authUser);
        setToken(parsedUser.token);
      } catch (error) {
        console.error("Error parsing auth_user from localStorage", error);
      }
    }
  }, [isHovered, internalCollapsed, propCollapsed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Calculate effective collapsed state (collapsed unless hovered)
  const effectiveCollapsed = internalCollapsed && !isHovered;

  return (
    <div 
      className={`
        fixed top-0 left-0 h-screen z-40
        bg-gradient-to-b from-zinc-900 to-black border-r border-[#B38B3F]/20
        flex flex-col transition-all duration-300 ease-in-out
        shadow-xl shadow-black/20
        ${effectiveCollapsed ? 'w-16' : 'w-64'}
      `}
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
            <SidebarItem 
              icon={<Home size={effectiveCollapsed ? 18 : 20} />} 
              text="Dashboard" 
              active={activePage === 'dashboard'} 
              collapsed={effectiveCollapsed} 
              onClick={() => onPageChange('dashboard')}
            />
            <SidebarItem 
              icon={<Phone size={effectiveCollapsed ? 18 : 20} />} 
              text="Phone System" 
              active={activePage === 'phone'} 
              collapsed={effectiveCollapsed} 
              onClick={() => onPageChange('phone')}
            />
            <SidebarItem 
              icon={<GitMerge size={effectiveCollapsed ? 18 : 20} />} 
              text="ProFlow Automation" 
              active={activePage === 'proflow'} 
              collapsed={effectiveCollapsed} 
              onClick={() => window.location.href =`http://localhost:8080/sign-in?token=${token}`}
              />
            <SidebarItem 
              icon={<FileText size={effectiveCollapsed ? 18 : 20} />} 
              text="DocuPro" 
              active={activePage === 'docupro'} 
              collapsed={effectiveCollapsed} 
              onClick={() => onPageChange('docupro')}
            />
            <SidebarItem 
              icon={<Users size={effectiveCollapsed ? 18 : 20} />} 
              text="CRM" 
              active={activePage === 'crm'} 
              collapsed={effectiveCollapsed} 
              onClick={() => onPageChange('crm')}
            />
          </ul>
          
          <div className="mt-6 pt-6 border-t border-[#B38B3F]/20">
            <ul className="space-y-2">
              {/* Team Panel - Only visible for Business Elite, Executive Users, Owner, Super Admin Users, and God Mode */}
              {(user?.role === 'owner' || 
                user?.role === 'super_admin' || 
                user?.role === 'executive' || 
                user?.plan === 'enterprise' || 
                user?.plan === 'god_mode') && (
                <SidebarItem 
                  icon={<UserCog size={effectiveCollapsed ? 18 : 20} />} 
                  text="Team Panel" 
                  active={activePage === 'team'} 
                  collapsed={effectiveCollapsed} 
                  onClick={() => onPageChange('team')}
                />
              )}
              
              {/* Admin section */}
              {(user?.role === 'owner' || user?.role === 'super_admin') && (
                <SidebarItem 
                  icon={<Shield size={effectiveCollapsed ? 18 : 20} className="text-[#FFD700]" />} 
                  text="Super Admin Panel" 
                  active={activePage === 'admin'} 
                  collapsed={effectiveCollapsed} 
                  onClick={() => onPageChange('admin')}
                  isAdmin
                />
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}