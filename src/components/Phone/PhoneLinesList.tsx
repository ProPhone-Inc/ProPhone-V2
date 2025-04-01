import React from 'react';
import { Search, Network, Phone, GripVertical, Plus } from 'lucide-react';
import type { PhoneLine } from '../../modules/phone/types';

interface PhoneLinesListProps {
  width: number;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  selectedLine: string | null;
  currentChat: string | null;
  conversations: Chat[];
  selectedChats: string[];
  setSelectedChats: React.Dispatch<React.SetStateAction<string[]>>;
  onChatSelect: (id: string) => void;
  onNewMessage: () => void;
  chatStatuses: Record<string, { label: string; icon: React.ReactNode }>;
  onMakeCall?: (number: string) => void;
  onDeleteChats: (chatIds: string[]) => void;
  onMarkRead: (chatIds: string[]) => void;
  onMarkUnread: (chatIds: string[]) => void;
  selectedProvider: string | null;
  providers: Array<{
    id: string;
    name: string;
    logo: string;
    lines: string[];
  }>;
  phoneLines: PhoneLine[];
  onLineSelect: (id: string) => void;
  onProviderClick: () => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onLineNameChange: (lineId: string, newName: string) => void;
  onNavigateToSettings: () => void;
}

export function PhoneLinesList({
  width,
  isResizing,
  onResizeStart,
  selectedLine,
  selectedProvider,
  providers,
  phoneLines,
  onLineSelect,
  onProviderClick,
  onReorder,
  onLineNameChange,
  onNavigateToSettings
}: PhoneLinesListProps) {
  const [editingLineId, setEditingLineId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  const editInputRef = React.useRef<HTMLInputElement>(null);
  const [localPhoneLines, setLocalPhoneLines] = React.useState(phoneLines);

  React.useEffect(() => {
    setLocalPhoneLines(phoneLines);
  }, [phoneLines]);

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

  return (
    <div 
      className="h-full border-r border-[#B38B3F]/20 bg-zinc-900/60 flex flex-col relative group"
      style={{ width }}
    >
      <div className="p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Inboxes</h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={onNavigateToSettings}
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
        {localPhoneLines.map((line) => (
          <button
            key={line.id}
            onClick={() => onLineSelect(line.id)}
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