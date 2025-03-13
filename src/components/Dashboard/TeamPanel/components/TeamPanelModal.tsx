import React from 'react';
import { X, UserCog } from 'lucide-react';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import { TeamPanel } from '../TeamPanel';
import { api } from '../../../../api/client';

interface TeamPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamPanelModal({ isOpen, onClose }: TeamPanelModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  
  useClickOutside(modalRef, () => {
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div 
        ref={modalRef}
        className="modal-container"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">Team Management</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <TeamPanel onClose={onClose} />
        </div>
      </div>
    </div>
  );
}