import { useState, useCallback } from 'react';

interface DraggableItem {
  id: string;
  [key: string]: any;
}

export function useDraggable() {
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: DraggableItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-[#FFD700]/20 border-2 border-[#FFD700] rounded-lg w-32 h-32';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 16, 16);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedItem(null);
  }, []);

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}