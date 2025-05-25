
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';

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
  
  const handleCardClick = () => {
    navigate(`/emails/${id}/all`);
  };
  
  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/emails/${id}/${status}`);
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer">
      {/* Compact Header */}
      <div 
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        onClick={handleCardClick}
      >
        <div className="flex items-center">
          <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center mr-3`}>
            <Icon className={`w-4 h-4 ${textColor}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <div className="flex items-center justify-center w-5 h-5 bg-purple-500 rounded-full text-white text-xs font-medium">
                {unread}
              </div>
            )}
            {pending > 0 && (
              <div className="flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full text-white text-xs font-medium">
                {pending}
              </div>
            )}
          </div>
          
          <span className="text-xs text-gray-500 min-w-[60px] text-right">
            {total} total
          </span>
          
          <button 
            onClick={toggleExpanded}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-3 mt-3">
            <div 
              className="flex items-center justify-between text-xs hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={(e) => handleStatusClick('unread', e)}
            >
              <span className="text-gray-600">Unread messages</span>
              <div className={`flex items-center justify-center w-5 h-5 ${unread > 0 ? 'bg-purple-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium`}>
                {unread > 0 ? unread : "-"}
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between text-xs hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={(e) => handleStatusClick('pending', e)}
            >
              <span className="text-gray-600">Pending replies</span>
              <div className={`flex items-center justify-center w-5 h-5 ${pending > 0 ? 'bg-amber-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium`}>
                {pending > 0 ? pending : "-"}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${color} transition-all duration-300`}
                  style={{ width: `${Math.min((unread + pending) / total * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {unread + pending > 0 ? `${unread + pending} items need attention` : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactCategoryItem;
