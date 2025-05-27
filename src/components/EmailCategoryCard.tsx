
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useEmailPreview } from '../hooks/useEmailPreview';
import { useFilteredEmailData } from '../hooks/useFilteredEmailData';
import { EmailCategory } from '../hooks/useEmailCategoryData';
import EmailPreviewTooltip from './email-category/EmailPreviewTooltip';

interface EmailCategoryCardProps {
  category: EmailCategory;
}

const EmailCategoryCard: React.FC<EmailCategoryCardProps> = ({ category }) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  const [hoveredStatus, setHoveredStatus] = useState<'unread' | 'pending' | 'unresponded' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  
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
  
  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/emails/${id}/${status}`);
  };

  const handleStatusHover = useCallback((status: 'unread' | 'pending' | 'unresponded', event: React.MouseEvent) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Capture the rect information immediately while event.currentTarget is valid
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2, // Center horizontally on the card
      y: rect.top // Top of the hovered element
    };

    // Set timeout to show tooltip after delay
    hoverTimeoutRef.current = setTimeout(() => {
      setTooltipPosition(position);
      setHoveredStatus(status);
    }, 800); // Reduced to 800ms for better responsiveness
  }, []);

  const handleStatusLeave = useCallback(() => {
    // Clear show timeout to prevent showing tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Only start hide timer if we're not already hiding
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Delay before hiding to allow moving to tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredStatus(null);
    }, 300);
  }, []);

  const handleTooltipClose = useCallback(() => {
    // Clear all timeouts and immediately hide
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setHoveredStatus(null);
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    // Cancel hide timeout when mouse enters tooltip
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
  
  return (
    <>
      <div 
        className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px] flex flex-col"
        onClick={handleCardClick}
      >
        {/* Header - Icon and title on the same row */}
        <div className="flex items-center mb-4 sm:mb-5">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${textColor} group-hover:animate-pulse`} />
          </div>
          
          {/* Title next to the icon */}
          <div className="flex items-center ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{title}</h3>
          </div>
        </div>

        {/* Stats section with fixed height for consistency */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Status rows container with fixed minimum height */}
          <div className="min-h-[72px] flex flex-col justify-start">
            {activeStatuses.length > 0 ? (
              <div className="space-y-0.5 sm:space-y-1">
                {activeStatuses.map((statusItem) => (
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
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">All caught up!</p>
                <p className="text-gray-400 text-xs mt-1">No pending items</p>
              </div>
            )}
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

      {/* Email Preview Tooltip */}
      {hoveredStatus && previewEmails.length > 0 && createPortal(
        <EmailPreviewTooltip
          emails={previewEmails}
          status={hoveredStatus}
          category={id}
          position={tooltipPosition}
          onClose={handleTooltipClose}
          onMouseEnter={handleTooltipMouseEnter}
          categoryColor={color}
        />,
        document.body
      )}
    </>
  );
};

export default EmailCategoryCard;
