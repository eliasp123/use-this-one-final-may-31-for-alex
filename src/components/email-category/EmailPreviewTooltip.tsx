import React, { useEffect, useState } from 'react';
import { EmailData } from '@/types/email';
import { formatDistanceToNow } from 'date-fns';
import { Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmailPreviewTooltipProps {
  emails: EmailData[];
  status: 'unread' | 'pending' | 'unresponded';
  category: string;
  position: { x: number; y: number };
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  categoryColor: string;
}

const EmailPreviewTooltip: React.FC<EmailPreviewTooltipProps> = ({
  emails,
  status,
  category,
  position,
  onClose,
  onMouseEnter,
  onMouseLeave,
  categoryColor
}) => {
  const navigate = useNavigate();
  const [smartPosition, setSmartPosition] = useState({ x: position.x, y: position.y, placement: 'right' });
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: position.x, y: position.y });

  // Calculate smart positioning for seamless card unfolding
  useEffect(() => {
    const tooltipHeight = 400; // Approximate height of tooltip
    const tooltipWidth = 480; // Max width from the component
    const margin = 20; // Safety margin from screen edges

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Find the card header element to align with its top edge
    // We need to traverse up from the hovered element to find the card container
    const findCardTop = () => {
      // Look for elements with the card classes to find the actual card top
      const cards = document.querySelectorAll('.bg-white.rounded-2xl');
      let closestCard = null;
      let minDistance = Infinity;
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left - position.x) + Math.abs(rect.top - position.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });
      
      if (closestCard) {
        const cardRect = closestCard.getBoundingClientRect();
        return {
          cardTop: cardRect.top,
          cardLeft: cardRect.left,
          cardRight: cardRect.right,
          cardWidth: cardRect.width
        };
      }
      
      // Fallback if we can't find the card
      return {
        cardTop: position.y - 150, // Estimate card header position
        cardLeft: position.x - 200,
        cardRight: position.x + 200,
        cardWidth: 400
      };
    };

    const cardInfo = findCardTop();
    
    let placement = 'right';
    let xPos = position.x;
    let yPos = cardInfo.cardTop; // Always align with the top of the card

    // Determine horizontal placement first (preferred for unfolding effect)
    const spaceRight = viewportWidth - cardInfo.cardRight - margin;
    const spaceLeft = cardInfo.cardLeft - margin;
    
    // Check if we can fit horizontally (preferred for card unfolding)
    if (spaceRight >= tooltipWidth) {
      // Unfold to the right - position at the right edge of the card
      placement = 'right';
      xPos = cardInfo.cardRight; // Start exactly at the card's right edge
    } else if (spaceLeft >= tooltipWidth) {
      // Unfold to the left - position at the left edge of the card
      placement = 'left';
      xPos = cardInfo.cardLeft - tooltipWidth; // End exactly at the card's left edge
    } else {
      // Fall back to vertical placement if horizontal doesn't fit
      const spaceAbove = cardInfo.cardTop - margin;
      const spaceBelow = viewportHeight - cardInfo.cardTop - margin;
      const shouldPlaceBelow = spaceAbove < tooltipHeight && spaceBelow > spaceAbove;
      
      placement = shouldPlaceBelow ? 'bottom' : 'top';
      xPos = cardInfo.cardLeft + (cardInfo.cardWidth / 2); // Center on card
      
      // Keep tooltip within horizontal bounds for vertical placement
      const halfWidth = tooltipWidth / 2;
      if (xPos - halfWidth < margin) {
        xPos = halfWidth + margin;
      } else if (xPos + halfWidth > viewportWidth - margin) {
        xPos = viewportWidth - halfWidth - margin;
      }
    }

    // For horizontal placement, ensure tooltip stays within vertical bounds
    if (placement === 'left' || placement === 'right') {
      // Ensure tooltip doesn't go below viewport
      if (yPos + tooltipHeight > viewportHeight - margin) {
        yPos = viewportHeight - tooltipHeight - margin;
      }
      
      // Ensure tooltip doesn't go above viewport
      if (yPos < margin) {
        yPos = margin;
      }
    }

    setSmartPosition({
      x: xPos,
      y: yPos,
      placement: placement as 'top' | 'bottom' | 'left' | 'right'
    });
    
    setCurrentPosition({ x: xPos, y: yPos });
  }, [position]);

  // Update tooltip position when scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Find the target card again to get its current position
      const cards = document.querySelectorAll('.bg-white.rounded-2xl');
      let targetCard = null;
      let minDistance = Infinity;
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left - position.x) + Math.abs(rect.top - position.y);
        if (distance < minDistance) {
          minDistance = distance;
          targetCard = card;
        }
      });

      if (targetCard) {
        const cardRect = targetCard.getBoundingClientRect();
        
        // Update position based on current card position
        let newX = currentPosition.x;
        let newY = cardRect.top; // Always align with the top of the card
        
        // Adjust for placement
        if (smartPosition.placement === 'right') {
          newX = cardRect.right;
        } else if (smartPosition.placement === 'left') {
          newX = cardRect.left - 480; // tooltip width
        }
        
        setCurrentPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position.x, position.y, smartPosition.placement, currentPosition.x]);

  // Smart scroll to ensure both card and tooltip are visible (with more aggressive scrolling)
  useEffect(() => {
    if (tooltipRef) {
      // Wait for tooltip to be fully rendered and positioned
      setTimeout(() => {
        const tooltipRect = tooltipRef.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Find the target card
        const cards = document.querySelectorAll('.bg-white.rounded-2xl');
        let targetCard = null;
        let minDistance = Infinity;
        
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left - position.x) + Math.abs(rect.top - position.y);
          if (distance < minDistance) {
            minDistance = distance;
            targetCard = card;
          }
        });

        if (targetCard) {
          const cardRect = targetCard.getBoundingClientRect();
          
          // Calculate the total area we need visible (card + tooltip)
          const topBound = Math.min(cardRect.top, tooltipRect.top);
          const bottomBound = Math.max(cardRect.bottom, tooltipRect.bottom);
          const leftBound = Math.min(cardRect.left, tooltipRect.left);
          const rightBound = Math.max(cardRect.right, tooltipRect.right);
          
          // Check if we need to scroll to make everything visible
          let needsScroll = false;
          let scrollAmount = 0;
          
          // Calculate how much we need to scroll vertically
          if (topBound < 0) {
            // Need to scroll up - add extra margin for better visibility
            scrollAmount = Math.abs(topBound) + 100; // Extra 100px margin
            needsScroll = true;
          } else if (bottomBound > viewportHeight) {
            // Need to scroll down
            scrollAmount = bottomBound - viewportHeight + 50; // Extra 50px margin
            needsScroll = true;
          }
          
          // If tooltip or card extends beyond viewport horizontally
          if (leftBound < 0 || rightBound > viewportWidth) {
            needsScroll = true;
          }
          
          if (needsScroll) {
            // Calculate target scroll position
            const currentScrollY = window.scrollY;
            let targetScrollY = currentScrollY;
            
            if (topBound < 0) {
              // Scroll up by the amount needed plus margin
              targetScrollY = currentScrollY + topBound - 100;
            } else if (bottomBound > viewportHeight) {
              // Scroll down
              targetScrollY = currentScrollY + (bottomBound - viewportHeight) + 50;
            }
            
            // Use smooth scroll with controlled timing
            window.scrollTo({
              top: targetScrollY,
              behavior: 'smooth'
            });
            
            // Add CSS to make scroll slower
            document.documentElement.style.scrollBehavior = 'smooth';
            setTimeout(() => {
              document.documentElement.style.scrollBehavior = '';
            }, 1000);
          }
        }
      }, 250);
    }
  }, [tooltipRef, position.x, position.y, smartPosition]);

  const getStatusLabel = () => {
    switch (status) {
      case 'unread':
        return 'Unread Messages';
      case 'pending':
        return 'Pending Replies';
      case 'unresponded':
        return 'Has Not Responded Yet';
    }
  };

  const getStatusRoute = () => {
    switch (status) {
      case 'unread':
        return 'unread';
      case 'pending':
        return 'pending';
      case 'unresponded':
        return 'no-response';
    }
  };

  const handleEmailClick = (emailId: string) => {
    navigate(`/emails/${category}/all`);
    onClose();
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleViewAll = () => {
    navigate(`/emails/${category}/${getStatusRoute()}`);
    onClose();
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const extractContentPreview = (content: string) => {
    // Remove HTML tags and get content
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    
    // Split into sentences and words to better control line breaks
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return '';
    
    // Build preview text that will fit approximately 3 lines
    let preview = '';
    let totalLength = 0;
    const maxLength = 240; // Increased to accommodate 3 lines
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (totalLength + trimmedSentence.length + 2 <= maxLength) {
        preview += (preview ? '. ' : '') + trimmedSentence;
        totalLength = preview.length;
      } else {
        // If adding this sentence would exceed limit, truncate it
        const remainingSpace = maxLength - totalLength - 2;
        if (remainingSpace > 20) { // Only add partial sentence if there's meaningful space
          preview += (preview ? '. ' : '') + trimmedSentence.substring(0, remainingSpace) + '...';
        }
        break;
      }
    }
    
    return preview || cleanContent.substring(0, maxLength) + (cleanContent.length > maxLength ? '...' : '');
  };

  if (emails.length === 0) {
    return null;
  };

  // No transform needed for seamless unfolding - position directly
  const getTransform = () => {
    switch (smartPosition.placement) {
      case 'left':
      case 'right':
        return 'translate(0, 0)'; // Perfect alignment, no transform needed
      case 'bottom':
        return 'translate(-50%, 8px)';
      case 'top':
      default:
        return 'translate(-50%, calc(-100% - 8px))';
    }
  };

  return (
    <div 
      ref={setTooltipRef}
      className="fixed bg-gray-50 border border-gray-200 rounded-lg shadow-xl p-4 max-w-[480px] pointer-events-auto z-[9999]"
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transform: getTransform(),
        position: 'fixed'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h4 className="text-sm font-semibold text-gray-800">{getStatusLabel()}</h4>
          <span className="text-xs text-gray-500">{emails.length} item{emails.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-3">
          {emails.map(email => (
            <div 
              key={email.id}
              className="p-3 bg-white/70 rounded-lg border border-gray-100 hover:bg-white cursor-pointer transition-colors"
              onClick={() => handleEmailClick(email.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-gray-700 text-sm">
                  {truncateText(email.sender.name, 25)}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                {truncateText(email.sender.organization, 40)}
              </div>
              
              <div className="text-sm font-medium text-gray-800 mb-2">
                {truncateText(email.subject, 60)}
              </div>
              
              {extractContentPreview(email.content) && (
                <div className="text-xs text-gray-700 leading-relaxed p-2 bg-amber-50 border border-amber-100 rounded min-h-[3.5rem]">
                  {extractContentPreview(email.content)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={handleViewAll}
          className="w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors mt-3 pt-2 border-t border-gray-100"
        >
          View All {getStatusLabel()}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default EmailPreviewTooltip;
