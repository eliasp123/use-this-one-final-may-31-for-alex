
import React, { useMemo } from 'react';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFilteredEmailData } from '../../hooks/useFilteredEmailData';
import { useTabletTooltipBehavior } from '../../hooks/useTabletTooltipBehavior';
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

  // Tooltip behavior hook
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

  const renderTooltipContent = () => {
    if (!hoveredStatus) return null;

    let content = '';
    let count = 0;

    switch (hoveredStatus) {
      case 'unread':
        content = unread === 1 ? 'unread message' : 'unread messages';
        count = unread;
        break;
      case 'pending':
        content = pending === 1 ? 'pending reply' : 'pending replies';
        count = pending;
        break;
      case 'unresponded':
        content = notRespondedCount === 1 ? 'has not responded yet' : 'have not responded yet';
        count = notRespondedCount;
        break;
    }

    return (
      <div 
        className="fixed z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-auto"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y - 35}px`,
          transform: 'translateX(-50%)'
        }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
        data-tooltip-content="true"
      >
        {count} {content}
      </div>
    );
  };

  const formatEmailDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group hover:translate-y-[-2px]">
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              {/* Left side - Icon, Title, and Chevron */}
              <div className="flex items-center">
                <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
                <h3 className="text-base font-medium text-gray-800 group-hover:text-gray-900 transition-colors mr-2">{title}</h3>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* Right side - Status indicators and total */}
              <div className="flex items-center gap-4">
                {/* Status badges */}
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <div 
                      className="flex items-center justify-center w-5 h-5 bg-purple-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => handleStatusClick('unread', e)}
                      onMouseEnter={(e) => handleStatusHover('unread', e, id, pending)}
                      onMouseLeave={handleStatusLeave}
                      data-tooltip-trigger="true"
                      title={`${unread} unread messages`}
                    >
                      {unread}
                    </div>
                  )}
                  {pending > 0 && (
                    <div 
                      className="flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
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
                      className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => handleStatusClick('no-response', e)}
                      onMouseEnter={(e) => handleStatusHover('unresponded', e, id, pending)}
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
              categoryEmails.slice(0, 5).map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={(e) => handleEmailClick(email.id, e)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {email.subject}
                      </p>
                      {!email.read && (
                        <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {email.sender.name} • {email.sender.organization}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                    {formatEmailDate(email.date)}
                  </div>
                </div>
              ))
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

      {/* Tooltip */}
      {hoveredStatus && renderTooltipContent()}
    </Collapsible>
  );
};

export default EmailCategoryListItem;
