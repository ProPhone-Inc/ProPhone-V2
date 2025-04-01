import { useState, useCallback, useRef } from 'react';

interface DraggableItem {
  id: string;
  [key: string]: any;
}

interface DragPosition {
  x: number;
  y: number;
}

export function useDraggable() {
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const dragStartPos = useRef<DragPosition | null>(null);
  const dragOffset = useRef<DragPosition>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleDragStart = useCallback((e: React.DragEvent, item: DraggableItem) => {
    setDraggedItem(item);
    isDragging.current = true;
    
    // Store initial drag position
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Calculate offset from the item's top-left corner
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Invisible drag image
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Update drag position for smooth movement
    if (dragStartPos.current) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      dragStartPos.current = {
        x: e.clientX,
        y: e.clientY
      };
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedItem(null);
    isDragging.current = false;
    dragStartPos.current = null;
  }, []);

  return {
    draggedItem,
    isDragging: isDragging.current,
    dragOffset: dragOffset.current,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}