import React from 'react';
import { Search, Filter, MessageSquare, Phone, CheckCircle } from 'lucide-react';
import type { Chat } from '../../modules/phone/types';

interface ChatPanelProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
}

export function ChatPanel({
  chats,
  selectedChat,
  onSelectChat,
  width,
  isResizing,
  onResizeStart
}: ChatPanelProps) {
  return (
    <div 
      className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/60 flex flex-col relative group"
      style={{ width }}
    >
      <div className="sticky top-0 z-10 p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Chats</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-[#FFD700]" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5 text-[#FFD700]" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-[#FFD700]" />
            </button>
          </div>
        </div>
      </div>
      {chats.length > 0 ? (
        <div className="flex-1 overflow-y-auto relative">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full p-4 text-left transition-colors relative ${
                selectedChat === chat.id
                  ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border-l-2 border-[#FFD700] shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                    {chat.avatar}
                  </div>
                  {chat.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0 w-[calc(100%-120px)]">
                  <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">{chat.name}</div>
                  <div className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                    chat.unread > 0 
                      ? 'text-white font-medium'
                      : chat.status === 'failed'
                        ? 'text-red-400'
                        : 'text-white/60'
                  }`}>
                    {chat.lastMessage}
                  </div>
                </div>
                <div className="ml-3 w-16 flex-shrink-0">
                  <div className="text-xs text-white/40 text-right">{chat.time}</div>
                  {chat.unread > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 min-w-[20px] h-5 rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/40 text-center p-8">
          <div>
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-white/60">No new messages</p>
          </div>
        </div>
      )}
      <div
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onResizeStart}
      />
    </div>
  );
}