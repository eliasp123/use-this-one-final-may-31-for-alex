
import { useState, useRef, useCallback } from 'react';

interface HoverState {
  isVisible: boolean;
  slideDirection: 'left' | 'right';
  position: { top: number; left?: number; right?: number };
}

export const useEmailPreviewHover = () => {
  const [hoverState, setHoverState] = useState<HoverState>({
    isVisible: false,
    slideDirection: 'left',
    position: { top: 0 }
  });
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      const rect = event.currentTarget.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const cardCenterX = rect.left + rect.width / 2;
      
      // Determine slide direction based on card position
      const slideDirection = cardCenterX > screenWidth / 2 ? 'right' : 'left';
      
      // Calculate position
      const top = rect.top + window.scrollY;
      const position = slideDirection === 'left'
        ? { top, left: rect.right + 20 } // Show to the right of the card
        : { top, right: screenWidth - rect.left + 20 }; // Show to the left of the card

      setHoverState({
        isVisible: true,
        slideDirection,
        position
      });
    }, 300); // 300ms delay
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setHoverState(prev => ({ ...prev, isVisible: false }));
    }, 100); // Small delay to prevent flickering
  }, []);

  const cleanup = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  }, []);

  return {
    hoverState,
    handleMouseEnter,
    handleMouseLeave,
    cleanup
  };
};
