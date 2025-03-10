import React from 'react';
import { Search, Phone, Plus, Building2 } from 'lucide-react';
import type { PhoneLine } from '../../modules/phone/types';

interface PhoneLinePanelProps {
  phoneLines: PhoneLine[];
  selectedLine: string | null;
  onSelectLine: (id: string) => void;
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
}

export function PhoneLinePanel({
  phoneLines,
  selectedLine,
  onSelectLine,
  width,
  isResizing,
  onResizeStart
}: PhoneLinePanelProps) {
  const getLineUnreadCount = (line: PhoneLine) => {
    return line.chats?.reduce((sum, chat) => sum + (chat.unread || 0), 0) || 0;
  };

  return (
    <div
      className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/70 flex flex-col relative group"
      style={{ width }}
    >
      <div className="p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Inboxes</h2>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
              <div className="relative">
                <Building2 className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
                  <Plus className="w-2 h-2 text-black" />
                </div>
              </div>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
              <div className="relative">
                <Phone className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
                  <Plus className="w-2 h-2 text-black" />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search lines..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {phoneLines.map((line) => (
          <button
            key={line.id}
            onClick={() => onSelectLine(line.id)}
            className={`w-full p-4 text-left transition-colors relative ${
              selectedLine === line.id
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border-l-2 border-[#FFD700] shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <div className="font-medium text-white">{line.name}</div>
                <div className="text-sm text-white/60">{line.number}</div>
              </div>
            </div>
            {getLineUnreadCount(line) > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 min-w-[20px] h-5 rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1">
                {getLineUnreadCount(line)}
              </div>
            )}
          </button>
        ))}
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onResizeStart}
      />
    </div>
  );
}