import React from 'react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function ResizeHandle({ onMouseDown, isResizing }: ResizeHandleProps) {
  return (
    <div
      className={`absolute inset-y-0 right-0 w-1 cursor-col-resize phone-border ${isResizing ? 'resizing' : ''}`}
      onMouseDown={onMouseDown}
    />
  );
}