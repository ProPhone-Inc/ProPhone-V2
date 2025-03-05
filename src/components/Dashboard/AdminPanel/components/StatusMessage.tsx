import React from 'react';
import { Trash2, PenSquare, X } from 'lucide-react';

interface StatusMessageProps {
  message: string;
  type: string;
}

export function StatusMessage({ message, type }: StatusMessageProps) {
  return (
    <div className={`
      p-4 rounded-lg flex items-center
      ${type === 'delete' 
        ? 'bg-red-500/20 border border-red-500/30' 
        : type === 'update' 
          ? 'bg-blue-500/20 border border-blue-500/30'
          : type === 'error' 
            ? 'bg-red-500/20 border border-red-500/30' 
            : 'bg-emerald-500/20 border border-emerald-500/30'
      }
    `}>
      <div className="w-5 h-5 mr-3 text-white/70">
        {type === 'delete' && <Trash2 className="w-full h-full" />}
        {type === 'update' && <PenSquare className="w-full h-full" />}
        {(type === 'error' || type === 'success') && <X className="w-full h-full" />}
      </div>
      <span className="text-white/70">{message}</span>
    </div>
  );
}