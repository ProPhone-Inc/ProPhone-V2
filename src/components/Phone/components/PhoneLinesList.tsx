import React from 'react';
import { Search, Network, Phone, GripVertical, Plus, ShoppingCart } from 'lucide-react';
import type { PhoneLine, Chat } from '../../../modules/phone/types';

interface PhoneLinesListProps {
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  onLineNameChange: (lineId: string, newName: string) => void;
  onSearch: () => void;
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
  onLineNameChange,
  onSearch,
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

  const [editingLineId, setEditingLineId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  const editInputRef = React.useRef<HTMLInputElement>(null);

  // Handle edit mode
  const handleStartEdit = (line: PhoneLine, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLineId(line.id);
    setEditingName(line.name);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 50);
  };

  const handleSaveName = () => {
    if (editingLineId && editingName.trim()) {
      onLineNameChange(editingLineId, editingName.trim());
    }
    setEditingLineId(null);
    setEditingName('');
  };

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
            <div className="flex items-center space-x-2">
              <button 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30 hover:bg-[#B38B3F]/30 transition-colors group relative"
                title="Buy Phone Number"
              >
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#FFD700] group-hover:scale-110 transition-transform duration-200" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
                    <Plus className="w-2 h-2 text-black" />
                  </div>
                </div>
              </button>
              <button 
                onClick={onProviderClick}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30 hover:bg-[#B38B3F]/30 transition-colors"
                title="Phone Providers"
              >
                <Network className="w-4 h-4 text-[#FFD700]" />
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
            type="text"
            placeholder="Search lines..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            readOnly
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
                {editingLineId === line.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveName();
                      } else if (e.key === 'Escape') {
                        setEditingLineId(null);
                        setEditingName('');
                      }
                    }}
                    className="w-full bg-transparent border-b border-[#FFD700] text-white font-medium focus:outline-none focus:border-[#FFD700]"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div 
                    className="font-medium text-white text-left group-hover:cursor-text"
                    onDoubleClick={(e) => handleStartEdit(line, e)}
                  >
                    {line.name}
                  </div>
                )}
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