import React, { useState, useRef, useCallback, useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useEmailPreview } from '../hooks/useEmailPreview';
import { useFilteredEmailData } from '../hooks/useFilteredEmailData';
import EmailPreviewTooltip from './email-category/EmailPreviewTooltip';

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

interface EmailCategoryCardProps {
  category: EmailCategory;
}

const EmailCategoryCard: React.FC<EmailCategoryCardProps> = ({ category }) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  const [hoveredStatus, setHoveredStatus] = useState<'unread' | 'pending' | 'unresponded' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  
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
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
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
    }, 1000); // Increased to 1000ms for more stable behavior
  }, []);

  const handleStatusLeave = useCallback(() => {
    // Clear timeout to prevent showing tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Longer delay before hiding to allow moving to tooltip
    setTimeout(() => {
      setHoveredStatus(null);
    }, 300); // Keep existing delay for hiding
  }, []);

  const handleTooltipClose = useCallback(() => {
    setHoveredStatus(null);
  }, []);
  
  return (
    <>
      <div 
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px]"
        onClick={handleCardClick}
      >
        {/* Header - Restructured to have icon and title on the same row */}
        <div className="flex items-center mb-6 sm:mb-8">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${textColor} group-hover:animate-pulse`} />
          </div>
          
          {/* Title next to the icon */}
          <div className="flex items-center ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{title}</h3>
          </div>
        </div>

        {/* Stats - Now with colored circles in the rows - adjusted to be 15% larger than the reduced size */}
        <div className="space-y-4 sm:space-y-5">
          <div 
            className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={(e) => handleStatusClick('unread', e)}
            onMouseEnter={(e) => unread > 0 && handleStatusHover('unread', e)}
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
            onMouseEnter={(e) => pending > 0 && handleStatusHover('pending', e)}
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
            onMouseEnter={(e) => notRespondedCount > 0 && handleStatusHover('unresponded', e)}
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
        
        {/* Total conversations - styled with category color and white text */}
        <div className={`flex items-center justify-between text-xs sm:text-sm mt-6 sm:mt-8 p-2 rounded-lg bg-gradient-to-r ${color} group-hover:shadow-lg transition-shadow`}>
          <span className="text-white font-medium">Total conversations</span>
          <span className="text-white font-bold">{total}</span>
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
          categoryColor={color}
        />,
        document.body
      )}
    </>
  );
};

export default EmailCategoryCard;
