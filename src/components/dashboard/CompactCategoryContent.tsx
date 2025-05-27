import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface CompactCategoryContentProps {
  category: EmailCategory;
  isExpanded: boolean;
  notRespondedCount: number;
  onStatusClick: (status: string, e: React.MouseEvent) => void;
  onStatusHover: (status: 'unread' | 'pending' | 'unresponded', e: React.MouseEvent) => void;
  onStatusLeave: () => void;
  onCardContentClick: () => void;
}

const CompactCategoryContent: React.FC<CompactCategoryContentProps> = ({
  category,
  isExpanded,
  notRespondedCount,
  onStatusClick,
  onStatusHover,
  onStatusLeave,
  onCardContentClick
}) => {
  const { id, unread, pending, total, color } = category;

  return (
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
          onClick={onCardContentClick}
        >
          {/* Stats with tooltip behavior - further reduced spacing for more compact layout */}
          <div className="space-y-1 sm:space-y-1.5">
            <div 
              className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={(e) => onStatusClick('unread', e)}
              onMouseEnter={(e) => {
                console.log('🔵 Unread hover:', { unread, categoryId: id });
                unread > 0 && onStatusHover('unread', e);
              }}
              onMouseLeave={onStatusLeave}
            >
              <span className="text-gray-600">Unread messages</span>
              <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${unread > 0 ? 'bg-purple-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                {unread > 0 ? unread : "-"}
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={(e) => onStatusClick('pending', e)}
              onMouseEnter={(e) => {
                console.log('🟡 Pending hover:', { pending, categoryId: id });
                pending > 0 && onStatusHover('pending', e);
              }}
              onMouseLeave={onStatusLeave}
            >
              <span className="text-gray-600">Pending replies</span>
              <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${pending > 0 ? 'bg-amber-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                {pending > 0 ? pending : "-"}
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={(e) => onStatusClick('no-response', e)}
              onMouseEnter={(e) => {
                console.log('🔴 Unresponded hover:', { notRespondedCount, categoryId: id });
                notRespondedCount > 0 && onStatusHover('unresponded', e);
              }}
              onMouseLeave={onStatusLeave}
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
  );
};

export default CompactCategoryContent;
