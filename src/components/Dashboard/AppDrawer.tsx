import React from 'react';
import { Phone, GitMerge, FileText, Users, X, ListChecks, Mail, DollarSign } from 'lucide-react';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAppSelect: (app: string) => void;
  currentApp: string;
}

export const AppDrawer = React.forwardRef<HTMLDivElement, AppDrawerProps>(({ isOpen, onClose, onAppSelect, currentApp }, ref) => {
  const apps = [
    { id: 'phone', name: 'Phone System', icon: <Phone className="w-5 h-5" /> },
    { id: 'proflow', name: 'ProFlow Automation', icon: <GitMerge className="w-5 h-5" /> },
    { id: 'docupro', name: 'DocuPro', icon: <FileText className="w-5 h-5" /> },
    { id: 'crm', name: 'CRM System', icon: <Users className="w-5 h-5" /> },
    { id: 'email', name: 'Email System', icon: <Mail className="w-5 h-5" /> },
    { id: 'investor', name: 'Investor Resources', icon: <DollarSign className="w-5 h-5" /> }
  ];

  if (!isOpen) return null;

  return (
    <div ref={ref} className="fixed right-4 top-20 w-[320px] bg-zinc-900/95 backdrop-blur-md border border-[#B38B3F]/20 rounded-xl shadow-2xl z-[999] animate-fade-in">
        <div className="p-4 border-b border-[#B38B3F]/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Applications</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {apps.filter(app => app.id !== currentApp).flatMap(app => 
              app.subItems ? app.subItems.map(subItem => (
                <button
                  key={subItem.id}
                  onClick={() => {
                    onAppSelect(subItem.id);
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center h-[120px] p-4 rounded-lg hover:bg-white/10 transition-colors group text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/5 to-[#B38B3F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-14 h-14 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center mb-3 group-hover:bg-[#B38B3F]/20 transition-colors">
                    {React.cloneElement(subItem.icon, { className: "w-6 h-6 text-[#FFD700]" })}
                  </div>
                  <span className="text-white/70 group-hover:text-white transition-colors text-sm font-medium min-h-[2.5rem] flex items-center">{subItem.name}</span>
                </button>
              )) : [
              <button
                key={app.id}
                onClick={() => {
                  onAppSelect(app.id);
                  onClose();
                }}
                className="flex flex-col items-center justify-center h-[120px] p-4 rounded-lg hover:bg-white/10 transition-colors group text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/5 to-[#B38B3F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center mb-3 group-hover:bg-[#B38B3F]/20 transition-colors">
                  {React.cloneElement(app.icon, { className: "w-6 h-6 text-[#FFD700]" })}
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors text-sm font-medium min-h-[2.5rem] flex items-center">{app.name}</span>
              </button>
              ]
            )}
          </div>
        </div>
    </div> 
  );
});

AppDrawer.displayName = 'AppDrawer';