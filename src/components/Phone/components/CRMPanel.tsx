import React from 'react';
import { User, Phone, MessageSquare, Users, Star, ChevronLeft, ChevronRight, Calendar, MapPin, Tag, Link2, Bell } from 'lucide-react';
import { useCallState } from '../../../hooks/useCallState';
import { useDB } from '../../../hooks/useDB';
import type { Chat } from '../../../modules/phone/types';

interface CRMPanelProps {
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  activeTab: 'crm' | 'audience';
  onTabChange: (tab: 'crm' | 'audience') => void;
  selectedChat: Chat | null;
}

export function CRMPanel({
  width,
  isResizing,
  onResizeStart,
  activeTab,
  onTabChange,
  selectedChat
}: CRMPanelProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { setActiveCall } = useCallState();
  const { getContacts } = useDB();
  const [contactData, setContactData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch contact data when chat changes
  React.useEffect(() => {
    const fetchContactData = async () => {
      if (!selectedChat?.number) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const contacts = await getContacts();
        const contact = contacts.find(c => 
          c.phone === selectedChat.number || 
          c.alternatePhones?.includes(selectedChat.number)
        );
        
        setContactData(contact || null);
      } catch (err) {
        console.error('Failed to fetch contact data:', err);
        setError('Failed to load contact information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, [selectedChat?.number, getContacts]);

  const handleMakeCall = () => {
    if (!selectedChat) return;
    setActiveCall({
      name: selectedChat.name,
      number: selectedChat.number || selectedChat.name
    });
  };

  return (
    <div 
      className={`h-full bg-zinc-900/80 flex flex-col relative group transition-all duration-300 ease-in-out ${
        isDrawerOpen ? 'w-[320px]' : 'w-[40px]'
      }`}
    >
      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className={`absolute -left-8 top-1/2 -translate-y-1/2 bg-zinc-900 border border-[#B38B3F]/20 rounded-l-lg flex items-center hover:bg-zinc-800 transition-colors z-10 group/toggle ${
          isDrawerOpen ? 'w-6 h-12 justify-center' : 'w-8 h-32 justify-center'
        }`}
      >
        {isDrawerOpen ? (
          <ChevronRight className="w-4 h-4 text-[#FFD700] group-hover/toggle:scale-110 transition-transform" />
        ) : (
          <div className="flex flex-col items-center">
            <ChevronLeft className="w-4 h-4 text-[#FFD700] group-hover/toggle:scale-110 transition-transform mb-1" />
            <span className="text-[#FFD700] text-xs writing-mode-vertical">More Information</span>
          </div>
        )}
        <div className="absolute inset-0 bg-[#FFD700]/10 rounded-l-lg opacity-0 group-hover/toggle:opacity-100 transition-opacity" />
      </button>

      {isDrawerOpen && (
        <>
          <div className="p-4 border-b border-[#B38B3F]/20">
            <div className="flex">
              <button
                onClick={() => onTabChange('crm')}
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                  activeTab === 'crm'
                    ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-[#FFD700]/10'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                CRM
              </button>
              <button
                onClick={() => onTabChange('audience')}
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                  activeTab === 'audience'
                    ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-[#FFD700]/10'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Audience
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'crm' ? (
              <div className="space-y-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Contact Info</h3>
                    {contactData ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-400 text-xs">Found in CRM</span>
                        <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                        Add to CRM
                      </button>
                    )}
                  </div>
                    </div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>Last Contact: 2 days ago</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>Location: New York, NY</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <Tag className="w-4 h-4" />
                      <span>Tags: VIP, High Priority</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <Link2 className="w-4 h-4" />
                      <span>Source: Website Inquiry</span>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                      <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 text-sm">{error}</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-white/70">
                        <User className="w-4 h-4" />
                        <span>{contactData?.name || selectedChat?.name || 'No contact selected'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/70">
                        <Phone className="w-4 h-4" />
                        <button
                          onClick={handleMakeCall}
                          className="hover:text-[#FFD700] transition-colors"
                        >
                          {selectedChat?.number || selectedChat?.name}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 text-white/70">
                        <MessageSquare className="w-4 h-4" />
                        <span>{contactData?.email || selectedChat?.email || 'No email available'}</span>
                      </div>
                      {contactData && (
                        <>
                          <div className="flex items-center space-x-2 text-white/70">
                            <MapPin className="w-4 h-4" />
                            <span>{contactData.address || 'No address available'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/70">
                            <Tag className="w-4 h-4" />
                            <div className="flex flex-wrap gap-2">
                              {contactData.tags?.map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-white/70">
                            <Link2 className="w-4 h-4" />
                            <span>{contactData.source || 'Unknown source'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Activity Timeline</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: 'call', time: '2 days ago', desc: 'Outbound call - 5 mins' },
                      { type: 'email', time: '3 days ago', desc: 'Email response received' },
                      { type: 'meeting', time: '1 week ago', desc: 'Property viewing scheduled' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center flex-shrink-0">
                          {activity.type === 'call' && <Phone className="w-4 h-4 text-[#FFD700]" />}
                          {activity.type === 'email' && <MessageSquare className="w-4 h-4 text-[#FFD700]" />}
                          {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-[#FFD700]" />}
                        </div>
                        <div>
                          <div className="text-white/90">{activity.desc}</div>
                          <div className="text-sm text-white/50">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Audience Segments</h3>
                    <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                      Create New
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-white">High-Value Leads</span>
                      </div>
                      <span className="text-white/40">1,234</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-white">VIP Clients</span>
                      </div>
                      <span className="text-white/40">567</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onResizeStart}
      />
    </div>
  );
}