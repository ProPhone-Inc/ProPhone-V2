import React, { useState } from 'react';
import { Bell, Menu, X, User, LogOut, Calendar, MessageSquare, Shield, HelpCircle } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { CalendarModal } from './Calendar';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    originalUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
  } | null;
  onLogout: () => void;
  collapsed: boolean;
  onPageChange?: (page: string) => void;
}

export function Header({ user, onLogout, collapsed, onPageChange }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { login } = useAuth();
  const menuRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setShowUserMenu(false);
  });
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-zinc-900 flex items-center justify-between px-4 z-10 relative">
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#B38B3F]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/50 to-[#B38B3F]/0 animate-[glow_4s_ease-in-out_infinite] shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
      </div>
      <div className="flex items-center lg:hidden">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className="flex-1" />

      <div className="flex items-center space-x-2">
        <button className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center px-1">
            8
          </span>
        </button>

        <button 
          onClick={() => setShowCalendar(true)}
          className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-emerald-500 text-black text-xs font-medium flex items-center justify-center px-1">
            3
          </span>
        </button>

        {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}

        <button className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1">
            12
          </span>
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center hover:bg-white/10 rounded-lg w-10 h-10 justify-center transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] flex items-center justify-center text-black font-semibold text-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(user?.name || 'User')
              )}
            </div>
          </button>
          
          {showUserMenu && (
            <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-[#B38B3F]/20 rounded-xl shadow-lg overflow-hidden z-10">
              <div className="p-4 border-b border-[#B38B3F]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] flex items-center justify-center text-black font-semibold text-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getInitials(user?.name || 'User')
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{user?.name}</div>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => {
                    onPageChange?.('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-white/10 transition-colors text-left"
                >
                  <User className="w-4 h-4 mr-3 text-white/70" />
                  <span>Profile</span>
                </button>
              </div>
              <div className="py-2 border-t border-[#B38B3F]/20 space-y-1">
                {user?.originalUser && (user?.originalUser?.role === 'super_admin' || user?.originalUser?.role === 'owner') && (
                  <button 
                    onClick={() => {
                      if (user.originalUser) {
                        setShowUserMenu(false);
                        login(user.originalUser);
                      }
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    <span className="whitespace-nowrap">Super Admin Panel</span>
                  </button>
                )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm hover:bg-white/10 transition-colors text-left text-red-500 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Sign out</span>
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  ); 
}