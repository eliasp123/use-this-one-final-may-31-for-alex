import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEmailPreview } from '../../hooks/useEmailPreview';
import { useFilteredEmailData } from '../../hooks/useFilteredEmailData';
import EmailPreviewTooltip from '../email-category/EmailPreviewTooltip';

interface EmailCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  unread: number;
  pending: number;
  total: number;
  color: string;
  bgColor: string;
  textColor: string;
}

interface CompactCategoryItemProps {
  category: EmailCategory;
}

const CompactCategoryItem: React.FC<CompactCategoryItemProps> = ({ category }) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStatus, setHoveredStatus] = useState<'unread' | 'pending' | 'unresponded' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [tooltipGracePeriod, setTooltipGracePeriod] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const expandTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollLockTimeoutRef = useRef<NodeJS.Timeout>();
  const gracePeriodTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get the actual count of unresponded emails for this category
  const { getFilteredUnrespondedEmails } = useFilteredEmailData();
  const notRespondedCount = useMemo(() => {
    return getFilteredUnrespondedEmails(id).length;
  }, [id, getFilteredUnrespondedEmails]);
  
  // Get preview emails for the currently hovered status
  const { previewEmails } = useEmailPreview({ 
    category: id, 
    status: hoveredStatus || 'unread' 
  });

  // Debug logging for pending emails
  useEffect(() => {
    console.log('📧 Category Debug:', {
      categoryId: id,
      categoryTitle: title,
      pendingCount: pending,
      unreadCount: unread,
      notRespondedCount,
      totalCount: total
    });
  }, [id, title, pending, unread, notRespondedCount, total]);

  // Debug logging for preview emails
  useEffect(() => {
    if (hoveredStatus) {
      console.log('🔍 Preview Debug:', {
        categoryId: id,
        hoveredStatus,
        previewEmailsCount: previewEmails.length,
        previewEmails: previewEmails.map(email => ({
          id: email.id,
          subject: email.subject,
          read: email.read,
          replied: email.replied,
          responseReceived: email.responseReceived
        }))
      });
    }
  }, [hoveredStatus, previewEmails, id]);

  // Listen for scroll events to activate scroll lock - but don't affect tooltip visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrollLocked(true);
      
      if (scrollLockTimeoutRef.current) {
        clearTimeout(scrollLockTimeoutRef.current);
      }
      
      scrollLockTimeoutRef.current = setTimeout(() => {
        setIsScrollLocked(false);
      }, 5000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollLockTimeoutRef.current) {
        clearTimeout(scrollLockTimeoutRef.current);
      }
    };
  }, []);

  // Gentle auto-scroll into view when accordion expands - increased padding to 44px
  useEffect(() => {
    if (isExpanded && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const padding = 44; // Increased from 24px to 44px for extra height
          
          // Check if the expanded accordion needs adjustment
          if (rect.bottom > viewportHeight - padding || rect.top < padding) {
            containerRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center', // Center the accordion for best viewing
              inline: 'nearest'
            });
          }
        }
      }, 200); // Slight delay to allow expansion animation
    }
  }, [isExpanded]);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
      if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);
      if (gracePeriodTimeoutRef.current) clearTimeout(gracePeriodTimeoutRef.current);
    };
  }, []);

  // Task 2: Accordion opens on hover with 300ms delay, stays open until manually closed
  const handleHeaderHover = () => {
    if (isScrollLocked) return;
    
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    
    expandTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
    }, 300); // 300ms delay as requested
  };

  const handleHeaderLeave = () => {
    // Clear expand timeout to prevent opening if user moves away quickly
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    // DO NOT auto-close on leave - stays open until manually closed
  };

  // Task 2: Click header to toggle accordion (no navigation)
  const handleHeaderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardContentClick = () => {
    // Only allow navigation from the card content, not the header
    navigate(`/emails/${id}/all`);
  };

  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/emails/${id}/${status}`);
  };

  // Enhanced tooltip behavior with grace period and debugging
  const handleStatusHover = useCallback((status: 'unread' | 'pending' | 'unresponded', event: React.MouseEvent) => {
    console.log('🔍 Status hover triggered:', {
      status,
      tooltipGracePeriod,
      hoveredStatus,
      isInGracePeriod: tooltipGracePeriod && hoveredStatus,
      categoryId: id,
      pendingCount: pending
    });

    // If we're in a grace period and a tooltip is already open, ignore new hovers
    if (tooltipGracePeriod && hoveredStatus) {
      console.log('🚫 Grace period active - ignoring hover for:', status);
      return;
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    hoverTimeoutRef.current = setTimeout(() => {
      console.log('✅ Opening tooltip for:', status, 'in category:', id);
      setTooltipPosition(position);
      setHoveredStatus(status);
      
      // Start grace period when tooltip opens
      setTooltipGracePeriod(true);
      console.log('🛡️ Grace period started for 1.5 seconds');
      
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
      
      gracePeriodTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Grace period ended');
        setTooltipGracePeriod(false);
      }, 1500); // Reduced to 1.5 second grace period for more natural feel
    }, 800);
  }, [tooltipGracePeriod, hoveredStatus, id, pending]);

  const handleStatusLeave = useCallback(() => {
    console.log('👋 Status leave triggered, grace period active:', tooltipGracePeriod);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      console.log('🔒 Closing tooltip after delay');
      setHoveredStatus(null);
      setTooltipGracePeriod(false);
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
    }, 1800); // Reduced to 1.8 seconds (1.5 seconds + 300ms)
  }, [tooltipGracePeriod]);

  const handleTooltipClose = useCallback(() => {
    console.log('❌ Manual tooltip close');
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (gracePeriodTimeoutRef.current) {
      clearTimeout(gracePeriodTimeoutRef.current);
    }
    setHoveredStatus(null);
    setTooltipGracePeriod(false);
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    handleTooltipClose();
  }, [handleTooltipClose]);

  return (
    <>
      <div className="space-y-0" ref={containerRef}>
        {/* Compact Header - Task 2: Click to toggle, hover to open */}
        <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
          <div 
            className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleHeaderClick}
            onMouseEnter={handleHeaderHover}
            onMouseLeave={handleHeaderLeave}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4`}>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${textColor}`} />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800">{title}</h3>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status indicators */}
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full text-white text-xs font-medium">
                    {unread}
                  </div>
                )}
                {pending > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full text-white text-xs font-medium">
                    {pending}
                  </div>
                )}
              </div>
              
              <span className="text-xs sm:text-sm text-gray-500 min-w-[80px] text-right">
                {total} total
              </span>
              
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`} />
            </div>
          </div>
        </div>

        {/* Expanded Full Card */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded 
              ? 'max-h-96 opacity-100 mt-4' 
              : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="animate-fade-in px-4 sm:px-6">
            <div 
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px]"
              onClick={handleCardContentClick}
            >
              {/* Stats with tooltip behavior */}
              <div className="space-y-4 sm:space-y-5">
                <div 
                  className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={(e) => handleStatusClick('unread', e)}
                  onMouseEnter={(e) => {
                    console.log('🔵 Unread hover:', { unread, categoryId: id });
                    unread > 0 && handleStatusHover('unread', e);
                  }}
                  onMouseLeave={handleStatusLeave}
                >
                  <span className="text-gray-600">Unread messages</span>
                  <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${unread > 0 ? 'bg-purple-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                    {unread > 0 ? unread : "-"}
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={(e) => handleStatusClick('pending', e)}
                  onMouseEnter={(e) => {
                    console.log('🟡 Pending hover:', { pending, categoryId: id });
                    pending > 0 && handleStatusHover('pending', e);
                  }}
                  onMouseLeave={handleStatusLeave}
                >
                  <span className="text-gray-600">Pending replies</span>
                  <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${pending > 0 ? 'bg-amber-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                    {pending > 0 ? pending : "-"}
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={(e) => handleStatusClick('no-response', e)}
                  onMouseEnter={(e) => {
                    console.log('🔴 Unresponded hover:', { notRespondedCount, categoryId: id });
                    notRespondedCount > 0 && handleStatusHover('unresponded', e);
                  }}
                  onMouseLeave={handleStatusLeave}
                >
                  <span className="text-gray-600">Has not responded yet</span>
                  <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${notRespondedCount > 0 ? 'bg-red-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                    {notRespondedCount > 0 ? notRespondedCount : "-"}
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-6">
                <div className="w-full bg-gray-100 rounded-full h-1 group-hover:bg-gray-200 transition-colors">
                  <div 
                    className={`h-1 rounded-full bg-gradient-to-r ${color} transition-all duration-300 group-hover:scale-x-105`}
                    style={{ width: `${Math.min((unread + pending) / total * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {unread + pending > 0 ? `${unread + pending} items need attention` : 'All caught up!'}
                </p>
              </div>
              
              {/* Total conversations */}
              <div className={`flex items-center justify-between text-xs sm:text-sm mt-6 sm:mt-8 p-2 rounded-lg bg-gradient-to-r ${color} group-hover:shadow-lg transition-shadow`}>
                <span className="text-white font-medium">Total conversations</span>
                <span className="text-white font-bold">{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Tooltip - now persists during scroll */}
      {hoveredStatus && previewEmails.length > 0 && createPortal(
        <div data-tooltip="email-preview">
          <EmailPreviewTooltip
            emails={previewEmails}
            status={hoveredStatus}
            category={id}
            position={tooltipPosition}
            onClose={handleTooltipClose}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
            categoryColor={color}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default CompactCategoryItem;
