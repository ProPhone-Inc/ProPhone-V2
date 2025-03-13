import React, { useState } from 'react';
import { Bell, Menu, X, User, LogOut, Calendar, MessageSquare, Shield, HelpCircle, Phone, Mail, Grid, Users, FileText, GitMerge, Settings } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { CalendarModal } from './Calendar';
import { useAuth } from '../../hooks/useAuth';
import { useSystemNotifications } from '../../hooks/useSystemNotifications';
import { SystemNotificationsPanel } from './SystemNotificationsPanel';
import { useNotifications } from '../../hooks/useNotifications';
import { useDB } from '../../hooks/useDB';

interface Message {
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
}

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
  activePage: string;
  messages: Array<{
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
  }>;
  messages: Message[];
  onPageChange?: (page: string, messageId?: string) => void;
}

function Header({ user, onLogout, collapsed, activePage, messages, onPageChange }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount: unreadNotifications } = useSystemNotifications();
  const { sendNotification } = useNotifications();
  const { login } = useAuth();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const readMessageIds = React.useRef<Set<string>>(new Set());
  const messagesRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const totalUnreadCount = messages.filter(msg => !msg.read).length;
  const [unreadCount, setUnreadCount] = React.useState(0);

  useClickOutside(menuRef, () => {
    setShowUserMenu(false);
  });
  
  useClickOutside(messagesRef, () => {
    setShowMessagesDropdown(false);
  });
  
  useClickOutside(notificationsRef, () => {
    setShowNotifications(false);
  });
  
  // Calculate unread count from messages
  React.useEffect(() => {
    const count = messages.filter(msg => !msg.read).length;
    setUnreadCount(count);
  }, [messages]);

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
        {(activePage === 'crm' || activePage === 'docupro' || activePage === 'proflow') && (
          <button className="relative w-10 h-10 rounded-lg hover:bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] transition-all duration-300 group">
          <div className="absolute inset-0 rounded-lg bg-[#FFD700]/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Grid className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10 animate-pulse" />
          <div className="absolute inset-0 rounded-lg border border-[#FFD700]/20 group-hover:border-[#FFD700]/40 transition-colors duration-300" />
          <div className="absolute -inset-1 bg-[#FFD700]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-full right-0 mt-1 w-64 bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
            <div className="grid grid-cols-2 gap-2">
              {[
              { id: 'phone', icon: <Phone className="w-5 h-5" />, label: 'Phone System' },
              { id: 'proflow', icon: <GitMerge className="w-5 h-5" />, label: 'ProFlow Automation' },
              { id: 'docupro', icon: <FileText className="w-5 h-5" />, label: 'DocuPro' },
              { id: 'crm', icon: <Users className="w-5 h-5" />, label: 'CRM System' }
              ].filter(app => app.id !== activePage).map((app, index) => (
              <div
                key={index}
                onClick={() => onPageChange?.(app.id)}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-white/10 transition-colors group/app cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center mb-2 group-hover/app:bg-[#B38B3F]/20 transition-colors">
                  {React.cloneElement(app.icon, { className: "w-5 h-5 text-[#FFD700]" })}
                </div>
                <span className="text-xs text-white/70 group-hover/app:text-white transition-colors text-center">{app.label}</span>
              </div>
              ))}
            </div>
          </div>
        </button>)}

        <button className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <div className="relative" ref={messagesRef}>
        <div 
          onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
          className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className={`absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1 ${unreadCount === 0 ? 'hidden' : ''}`}>
            {unreadCount}
          </span>
        </div>
        
        {showMessagesDropdown && (
          <div className="fixed right-4 mt-2 w-96 bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl overflow-hidden z-[50]">
            <div className="p-4 border-b border-[#B38B3F]/20">
              <h3 className="text-lg font-bold text-white">Messages</h3>
              <p className="text-sm text-white/60">{totalUnreadCount} unread messages</p>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setShowMessagesDropdown(false);
                    // Navigate to phone system and pass the message ID
                    if (onPageChange) {
                      onPageChange('phone', message.id);
                    }
                  }}
                  className="w-full p-4 hover:bg-white/5 transition-colors border-b border-[#B38B3F]/10 text-left flex items-start space-x-3"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={message.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}&background=B38B3F&color=fff`}
                        alt={message.sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!message.read && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFD700] border-2 border-zinc-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{message.sender.name}</div>
                    <div className="text-xs text-white/40 mb-1">{message.time}</div>
                    {!message.read && (
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full mb-1" />
                    )}
                    <div className="flex items-center space-x-2 mt-0.5">
                      {message.type === 'email' && <Mail className="w-3 h-3 text-[#FFD700]" />}
                      {message.type === 'call' && <Phone className="w-3 h-3 text-[#FFD700]" />}
                      {message.type === 'sms' && <MessageSquare className="w-3 h-3 text-[#FFD700]" />}
                      <span className="text-sm font-medium text-white/90">{message.title}</span>
                    </div>
                    <p className="text-sm text-white/60 truncate mt-1">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-[#B38B3F]/20">
              <div className="w-full py-2 text-center text-[#FFD700] hover:text-[#FFD700]/80 font-medium transition-colors cursor-pointer">
                View All Messages
              </div>
            </div>
          </div>
        )}
        </div>

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

        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <SystemNotificationsPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

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

export default Header;