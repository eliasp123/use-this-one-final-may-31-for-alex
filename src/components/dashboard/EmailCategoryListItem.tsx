import React, { useMemo } from 'react';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useFilteredEmailData } from '../../hooks/useFilteredEmailData';
import { useEmailPreview } from '../../hooks/useEmailPreview';
import { useTabletTooltipBehavior } from '../../hooks/useTabletTooltipBehavior';
import EmailPreviewTooltip from '../email-category/EmailPreviewTooltip';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '../ui/collapsible';

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

interface EmailCategoryListItemProps {
  category: EmailCategory;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const EmailCategoryListItem: React.FC<EmailCategoryListItemProps> = ({ 
  category, 
  isExpanded = false, 
  onToggle 
}) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  
  // Get the actual count of unresponded emails for this category
  const { getFilteredEmailData, getFilteredUnrespondedEmails } = useFilteredEmailData();
  const notRespondedCount = useMemo(() => {
    return getFilteredUnrespondedEmails(id).length;
  }, [id, getFilteredUnrespondedEmails]);

  // Get emails for this category to show in accordion
  const categoryEmails = useMemo(() => {
    return getFilteredEmailData().filter(email => email.category === id);
  }, [id, getFilteredEmailData]);

  // Tooltip behavior hook for status circles
  const {
    hoveredStatus,
    tooltipPosition,
    isTablet,
    handleStatusHover,
    handleStatusLeave,
    handleTooltipClose,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave
  } = useTabletTooltipBehavior();

  // Separate state for email row hover
  const [hoveredEmailId, setHoveredEmailId] = React.useState<string | null>(null);
  const [emailTooltipPosition, setEmailTooltipPosition] = React.useState({ x: 0, y: 0 });

  // Get preview emails for the currently hovered status
  const { previewEmails } = useEmailPreview({ 
    category: id, 
    status: hoveredStatus || 'unread' 
  });

  // Get single email for preview when hovering over email row
  const hoveredEmail = useMemo(() => {
    if (!hoveredEmailId) return null;
    return categoryEmails.find(email => email.id === hoveredEmailId);
  }, [hoveredEmailId, categoryEmails]);
  
  const handleClick = () => {
    navigate(`/emails/${id}/all`);
  };
  
  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/emails/${id}/${status}`);
  };

  const handleEmailClick = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/emails/${id}/all`, { state: { selectedEmailId: emailId } });
  };

  // Handle email row hover - completely rewritten positioning logic
  const handleEmailHover = (emailId: string, e: React.MouseEvent) => {
    const emailRect = e.currentTarget.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const tooltipWidth = 480;
    const tooltipHeight = 300;
    
    // Calculate horizontal position (left or right of the email row)
    let x = emailRect.right + 10; // Default to right side
    if (emailRect.right + tooltipWidth > screenWidth - 20) {
      x = emailRect.left - tooltipWidth - 10; // Position on left if no space on right
    }
    
    // Calculate vertical position (centered on the email row)
    let y = emailRect.top + (emailRect.height / 2) - (tooltipHeight / 2);
    
    // Ensure tooltip doesn't go above the top of the screen
    if (y < 20) {
      y = 20;
    }
    
    // Ensure tooltip doesn't go below the bottom of the screen
    if (y + tooltipHeight > screenHeight - 20) {
      y = screenHeight - tooltipHeight - 20;
    }
    
    console.log('Email hover positioning:', {
      emailRect: {
        top: emailRect.top,
        bottom: emailRect.bottom,
        left: emailRect.left,
        right: emailRect.right,
        height: emailRect.height
      },
      calculatedPosition: { x, y },
      screenDimensions: { width: screenWidth, height: screenHeight }
    });
    
    setEmailTooltipPosition({ x, y });
    setHoveredEmailId(emailId);
  };

  const handleEmailLeave = () => {
    setHoveredEmailId(null);
  };

  // Update tooltip positioning for status circles to use left/right
  const getSmartTooltipPosition = (basePosition: { x: number; y: number }) => {
    const screenWidth = window.innerWidth;
    const tooltipWidth = 480;
    
    let x = basePosition.x + 10; // Default to right
    
    // If not enough space on the right, position on the left
    if (basePosition.x + tooltipWidth > screenWidth - 20) {
      x = basePosition.x - tooltipWidth - 10;
    }
    
    return {
      x,
      y: basePosition.y - 40 // Align with category row
    };
  };

  // Helper function to get email status indicators
  const getEmailStatusIndicators = (email: any) => {
    const indicators = [];
    if (!email.read) {
      indicators.push({ type: 'unread', color: 'bg-purple-500' });
    }
    if (email.read && !email.replied) {
      indicators.push({ type: 'pending', color: 'bg-amber-500' });
    }
    if (email.replied && !email.responseReceived) {
      indicators.push({ type: 'unresponded', color: 'bg-red-500' });
    }
    return indicators;
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group hover:translate-y-[-2px]"
            data-category-card={id}
          >
            <CollapsibleTrigger asChild>
              <div className="p-4 cursor-pointer">
                <div className="flex items-center justify-between">
                  {/* Left side - Icon, Title, and Chevron */}
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${textColor}`} />
                    </div>
                    <h3 className="text-base font-medium text-gray-800 group-hover:text-gray-900 transition-colors mr-3">{title}</h3>
                    {/* Bigger, more prominent chevron */}
                    {isExpanded ? (
                      <ChevronDown className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                    )}
                  </div>

                  {/* Right side - Status indicators and total */}
                  <div className="flex items-center gap-4">
                    {/* Status badges with increased spacing and larger hover areas */}
                    <div className="flex items-center gap-6">
                      {unread > 0 && (
                        <div 
                          className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                          onClick={(e) => handleStatusClick('unread', e)}
                          onMouseEnter={(e) => handleStatusHover('unread', e, id, unread)}
                          onMouseLeave={handleStatusLeave}
                          data-tooltip-trigger="true"
                          title={`${unread} unread messages`}
                        >
                          {unread}
                        </div>
                      )}
                      {pending > 0 && (
                        <div 
                          className="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                          onClick={(e) => handleStatusClick('pending', e)}
                          onMouseEnter={(e) => handleStatusHover('pending', e, id, pending)}
                          onMouseLeave={handleStatusLeave}
                          data-tooltip-trigger="true"
                          title={`${pending} pending replies`}
                        >
                          {pending}
                        </div>
                      )}
                      {notRespondedCount > 0 && (
                        <div 
                          className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                          onClick={(e) => handleStatusClick('no-response', e)}
                          onMouseEnter={(e) => handleStatusHover('unresponded', e, id, notRespondedCount)}
                          onMouseLeave={handleStatusLeave}
                          data-tooltip-trigger="true"
                          title={`${notRespondedCount} have not responded yet`}
                        >
                          {notRespondedCount}
                        </div>
                      )}
                    </div>

                    {/* Total count */}
                    <span className="text-sm text-gray-500 font-medium min-w-[60px] text-right">
                      {total} total
                    </span>

                    {/* Progress bar */}
                    <div className="w-20">
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full bg-gradient-to-r ${color} transition-all duration-300`}
                          style={{ width: `${Math.min((unread + pending) / total * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 pb-4">
              <div className="mt-2 space-y-2 border-t pt-4">
                {categoryEmails.length > 0 ? (
                  categoryEmails.slice(0, 5).map((email) => {
                    const statusIndicators = getEmailStatusIndicators(email);
                    return (
                      <div
                        key={email.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={(e) => handleEmailClick(email.id, e)}
                        onMouseEnter={(e) => handleEmailHover(email.id, e)}
                        onMouseLeave={handleEmailLeave}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {email.subject}
                            </p>
                            {/* Status indicators for each email */}
                            {statusIndicators.map((indicator, index) => (
                              <span 
                                key={index}
                                className={`w-2 h-2 ${indicator.color} rounded-full flex-shrink-0`}
                              ></span>
                            ))}
                          </div>
                          {/* Show From/To information */}
                          <p className="text-xs text-gray-600 truncate">
                            From: {email.sender.name} ({email.sender.organization})
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            To: {email.recipient}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                          {formatEmailDate(email.date)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No emails in this category
                  </p>
                )}
                {categoryEmails.length > 5 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={handleClick}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all {categoryEmails.length} emails →
                    </button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Email Preview Tooltip for Status Circles - Left/Right positioning */}
        {hoveredStatus && previewEmails.length > 0 && createPortal(
          <div data-tooltip="email-preview">
            <EmailPreviewTooltip
              emails={previewEmails}
              status={hoveredStatus}
              category={id}
              position={getSmartTooltipPosition(tooltipPosition)}
              onClose={handleTooltipClose}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
              categoryColor={color}
            />
          </div>,
          document.body
        )}

        {/* Email Preview Tooltip for Individual Email Rows */}
        {hoveredEmailId && hoveredEmail && createPortal(
          <div data-tooltip="email-preview">
            <EmailPreviewTooltip
              emails={[hoveredEmail]}
              status="unread" // We'll show the email regardless of status
              category={id}
              position={emailTooltipPosition}
              onClose={() => setHoveredEmailId(null)}
              onMouseEnter={() => {}} // Keep tooltip open when hovering over it
              onMouseLeave={() => setHoveredEmailId(null)}
              categoryColor={color}
            />
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default EmailCategoryListItem;
