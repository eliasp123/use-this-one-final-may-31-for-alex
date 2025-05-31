import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useEmailPreview } from '../hooks/useEmailPreview';
import { useFilteredEmailData } from '../hooks/useFilteredEmailData';
import { EmailCategory } from '../hooks/useEmailCategoryData';
import EmailPreviewTooltip from './email-category/EmailPreviewTooltip';

interface EmailCategoryCardProps {
  category: EmailCategory;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const EmailCategoryCard: React.FC<EmailCategoryCardProps> = ({ 
  category, 
  isExpanded: externalIsExpanded,
  onToggle: externalOnToggle 
}) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  const categoryCardRef = useRef<HTMLDivElement>(null);
  const [hoveredStatus, setHoveredStatus] = useState<'unread' | 'pending' | 'unresponded' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Use external state if provided, otherwise use internal state
  const [internalIsExpanded, setInternalIsExpanded] = useState(true);
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const onToggle = externalOnToggle || (() => setInternalIsExpanded(!internalIsExpanded));
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const expandTimeoutRef = useRef<NodeJS.Timeout>();
  
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
  
  const handleCardClick = () => {
    navigate(`/emails/${id}/all`);
  };
  
  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleHeaderHover = useCallback(() => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    
    // Only auto-expand if using internal state (not externally controlled)
    if (externalIsExpanded === undefined) {
      expandTimeoutRef.current = setTimeout(() => {
        setInternalIsExpanded(true);
      }, 300);
    }
  }, [externalIsExpanded]);

  const handleHeaderLeave = useCallback(() => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    // Don't auto-close on leave - stays open until manually closed
  }, []);

  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/emails/${id}/${status}`);
  };

  const handleStatusHover = useCallback((status: 'unread' | 'pending' | 'unresponded', event: React.MouseEvent) => {
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
      setTooltipPosition(position);
      setHoveredStatus(status);
    }, 800);
  }, []);

  const handleStatusLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredStatus(null);
    }, 300);
  }, []);

  const handleTooltipClose = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setHoveredStatus(null);
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  // Create array of active statuses (only show rows with activity)
  const activeStatuses = [
    ...(unread > 0 ? [{
      label: 'Unread messages',
      count: unread,
      color: 'bg-purple-500',
      status: 'unread' as const,
      navStatus: 'unread'
    }] : []),
    ...(pending > 0 ? [{
      label: 'Pending replies',
      count: pending,
      color: 'bg-amber-500',
      status: 'pending' as const,
      navStatus: 'pending'
    }] : []),
    ...(notRespondedCount > 0 ? [{
      label: 'Has not responded yet',
      count: notRespondedCount,
      color: 'bg-red-500',
      status: 'unresponded' as const,
      navStatus: 'no-response'
    }] : [])
  ];

  // Always create exactly 3 status rows for consistent height
  const statusRows = [];
  for (let i = 0; i < 3; i++) {
    if (i < activeStatuses.length) {
      const statusItem = activeStatuses[i];
      statusRows.push(
        <div 
          key={statusItem.status}
          className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-1.5 rounded transition-colors"
          onClick={(e) => handleStatusClick(statusItem.navStatus, e)}
          onMouseEnter={(e) => handleStatusHover(statusItem.status, e)}
          onMouseLeave={handleStatusLeave}
        >
          <span className="text-gray-600">{statusItem.label}</span>
          <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${statusItem.color} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
            {statusItem.count}
          </div>
        </div>
      );
    } else {
      // Add invisible placeholder rows to maintain consistent height
      statusRows.push(
        <div key={`placeholder-${i}`} className="flex items-center justify-between text-xs sm:text-sm p-1.5 opacity-0 pointer-events-none">
          <span>Placeholder</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6"></div>
        </div>
      );
    }
  }
  
  return (
    <>
      <div 
        ref={categoryCardRef}
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px] flex flex-col ${
          isExpanded ? 'p-4 sm:p-5' : 'p-2 sm:p-3'
        }`}
        onClick={handleCardClick}
      >
        {/* Header - Icon and title with accordion functionality */}
        <div 
          className={`flex items-center justify-center ${isExpanded ? 'mb-4 sm:mb-5' : ''} hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer`}
          onClick={handleHeaderClick}
          onMouseEnter={handleHeaderHover}
          onMouseLeave={handleHeaderLeave}
        >
          <div className="flex items-center flex-col text-center">
            <div className={`${isExpanded ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'} ${bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-2`}>
              <Icon className={`${isExpanded ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5 sm:w-6 sm:h-6'} ${textColor} group-hover:animate-pulse`} />
            </div>
            
            {/* Title always centered below icon */}
            <div className="flex items-center">
              <h3 className={`${isExpanded ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} font-medium text-gray-800 group-hover:text-gray-900 transition-colors`}>{title}</h3>
            </div>
          </div>
        </div>

        {/* Accordion Content - Stats section with consistent height */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex-1 flex flex-col justify-between">
            {/* Status rows container with fixed height for exactly 3 rows */}
            <div className="h-[96px] flex flex-col justify-start">
              <div className="space-y-1">
                {statusRows}
              </div>
            </div>

            {/* Bottom sections - always positioned consistently */}
            <div className="mt-4 space-y-4">
              {/* Progress indicator - only show if there's activity */}
              {activeStatuses.length > 0 && (
                <div>
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
              )}
              
              {/* Total conversations - styled with category color and white text */}
              <div className={`flex items-center justify-between text-xs sm:text-sm p-2 rounded-lg bg-gradient-to-r ${color} group-hover:shadow-lg transition-shadow`}>
                <span className="text-white font-medium">Total conversations</span>
                <span className="text-white font-bold">{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Tooltip with category card ref */}
      {hoveredStatus && previewEmails.length > 0 && createPortal(
        <EmailPreviewTooltip
          emails={previewEmails}
          status={hoveredStatus}
          category={id}
          position={tooltipPosition}
          onClose={handleTooltipClose}
          onMouseEnter={handleTooltipMouseEnter}
          categoryColor={color}
          categoryCardRef={categoryCardRef}
        />,
        document.body
      )}
    </>
  );
};

export default EmailCategoryCard;
