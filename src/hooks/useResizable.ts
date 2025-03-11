import { useCallback, useEffect, useState, useRef } from 'react';

interface UseResizableProps {
  minWidth?: number;
  maxWidth?: number;
  defaultWidth: number;
  storageKey?: string;
  direction?: 'left' | 'right';
  neighbor?: {
    width: number;
    setWidth: (width: number) => void;
    minWidth: number;
    maxWidth: number;
  };
}

export function useResizable({
  minWidth = 200,
  maxWidth = 600,
  defaultWidth,
  storageKey,
  direction = 'right',
  neighbor
}: UseResizableProps) {
  const [width, setWidth] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved) : defaultWidth;
    }
    return defaultWidth;
  });
  
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const startNeighborWidth = useRef<number>(0);
  const initialTotalWidth = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
    if (neighbor) {
      startNeighborWidth.current = neighbor.width;
      initialTotalWidth.current = width + neighbor.width;
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startX.current;
      
      // For left-anchored columns, dragging right increases width
      // For right-anchored columns (direction === 'left'), dragging right decreases width
      let newWidth = direction === 'left'
        ? startWidth.current - deltaX  // Right-anchored: dragging right decreases width
        : startWidth.current + deltaX; // Left-anchored: dragging right increases width

      // Constrain width to min/max
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      if (neighbor) {
        const newNeighborWidth = initialTotalWidth.current - newWidth;

        // Only apply changes if both widths are within constraints
        if (newNeighborWidth >= neighbor.minWidth && newNeighborWidth <= neighbor.maxWidth) {
          setWidth(newWidth);
          neighbor.setWidth(newNeighborWidth);
          
          if (storageKey) {
            localStorage.setItem(storageKey, newWidth.toString());
          }
        }
      } else {
        setWidth(newWidth);
        if (storageKey) {
          localStorage.setItem(storageKey, newWidth.toString());
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      startNeighborWidth.current = 0;
      initialTotalWidth.current = 0;
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, storageKey]);

  return {
    width,
    isResizing,
    handleMouseDown
  };
}