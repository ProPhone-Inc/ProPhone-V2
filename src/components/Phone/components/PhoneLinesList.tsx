import React from 'react';
import { Search, Network, Phone, GripVertical } from 'lucide-react';
import type { PhoneLine } from '../../../modules/phone/types';

interface PhoneLinesListProps {
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  phoneLines: PhoneLine[];
  selectedLine: string | null;
  selectedProvider: string | null;
  providers: Array<{
    id: string;
    name: string;
    logo: string;
    lines: string[];
  }>;
  conversations: Chat[];
  onLineSelect: (id: string) => void;
  onProviderClick: () => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function PhoneLinesList({
  width,
  isResizing,
  onResizeStart,
  phoneLines,
  selectedLine,
  selectedProvider,
  providers,
  conversations,
  onLineSelect,
  onProviderClick,
  onReorder
}: PhoneLinesListProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null) {
      onReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Calculate total unread messages for a phone line
  const getLineUnreadCount = (line: PhoneLine) => {
    // Get all conversations for this line
    const lineChats = line.chats.map(chat => chat.id);
    const total = conversations
      .filter(chat => lineChats.includes(chat.id))
      .reduce((sum, chat) => sum + (chat.unread || 0), 0);
    return total;
  };

  return (
    <div 
      className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/70 flex flex-col relative group"
      style={{ width }}
    >
      <div className="p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-bold text-white">Inboxes</h2>
            <button 
              onClick={onProviderClick}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30 hover:bg-[#B38B3F]/30 transition-colors"
            >
              <Network className="w-4 h-4 text-[#FFD700]" />
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
        {phoneLines
          .filter(line => !selectedProvider || providers.find(p => p.id === selectedProvider)?.lines.includes(line.id))
          .map((line, index) => (
          <div
            key={line.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`w-full p-4 text-left transition-colors relative ${
              dragOverIndex === index
                ? 'border-t-2 border-[#FFD700]'
                : draggedIndex === index
                ? 'opacity-50'
                : ''
            } ${
              selectedLine === line.id
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border-l-2 border-[#FFD700] shadow-[inset_0_0_20px_rgba(255,215,0,0.1)] hover:from-[#FFD700]/30'
                : 'hover:bg-white/5'
            }`}
          >
            <button
              onClick={() => onLineSelect(line.id)}
              className="w-full flex items-start text-left"
            >
              <div className="flex items-center justify-center mr-2 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-white/40 hover:text-white/60 transition-colors" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center flex-shrink-0 mr-3">
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-left">{line.name}</div>
                <div className="text-sm text-white/60">{line.number}</div>
              </div>
              {getLineUnreadCount(line) > 0 && (
                <div className="ml-3 min-w-[20px] h-5 rounded-full bg-[#FFD700] text-black text-xs font-medium flex items-center justify-center px-1.5">
                  {getLineUnreadCount(line)}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onResizeStart}
      />
    </div>
  );
}