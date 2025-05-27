
import React, { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFilteredEmailData } from '../../hooks/useFilteredEmailData';

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
}

const EmailCategoryListItem: React.FC<EmailCategoryListItemProps> = ({ category }) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  
  // Get the actual count of unresponded emails for this category
  const { getFilteredUnrespondedEmails } = useFilteredEmailData();
  const notRespondedCount = useMemo(() => {
    return getFilteredUnrespondedEmails(id).length;
  }, [id, getFilteredUnrespondedEmails]);
  
  const handleClick = () => {
    navigate(`/emails/${id}/all`);
  };
  
  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/emails/${id}/${status}`);
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-2px]"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Title */}
        <div className="flex items-center">
          <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${textColor}`} />
          </div>
          <h3 className="text-base font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{title}</h3>
        </div>

        {/* Right side - Status indicators and total */}
        <div className="flex items-center gap-4">
          {/* Status badges */}
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <div 
                className="flex items-center justify-center w-5 h-5 bg-purple-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => handleStatusClick('unread', e)}
                title={`${unread} unread messages`}
              >
                {unread}
              </div>
            )}
            {pending > 0 && (
              <div 
                className="flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => handleStatusClick('pending', e)}
                title={`${pending} pending replies`}
              >
                {pending}
              </div>
            )}
            {notRespondedCount > 0 && (
              <div 
                className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => handleStatusClick('no-response', e)}
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
  );
};

export default EmailCategoryListItem;
