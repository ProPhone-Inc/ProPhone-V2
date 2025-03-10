import React from 'react';
import { User, Phone, MessageSquare, Users, Star } from 'lucide-react';
import type { Chat } from '../../modules/phone/types';

interface ChatDetailsProps {
  chat: Chat | null;
  activeTab: 'crm' | 'audience';
  onTabChange: (tab: 'crm' | 'audience') => void;
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
}

export function ChatDetails({
  chat,
  activeTab,
  onTabChange,
  width,
  isResizing,
  onResizeStart
}: ChatDetailsProps) {
  if (!chat) {
    return (
      <div 
        className="h-full bg-zinc-900/80 flex flex-col relative group"
        style={{ width }}
      >
        <div className="flex-1 flex items-center justify-center text-white/40 text-center p-8">
          <div>
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Contact Selected</h3>
            <p className="text-white/60">Select a conversation to view contact details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full bg-zinc-900/80 flex flex-col relative group"
      style={{ width }}
    >
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
                <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white/70">
                  <User className="w-4 h-4" />
                  <span>{chat.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <Phone className="w-4 h-4" />
                  <span>{chat.number}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <MessageSquare className="w-4 h-4" />
                  <span>{chat.email || 'No email available'}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Notes</h3>
                <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                  Add Note
                </button>
              </div>
              {chat.notes ? (
                <div className="text-sm text-white/70">{chat.notes}</div>
              ) : (
                <div className="text-sm text-white/40">No notes available</div>
              )}
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
              {chat.segments?.length > 0 ? (
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
              ) : (
                <div className="text-sm text-white/40">No segments available</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onResizeStart}
      />
    </div>
  );
}