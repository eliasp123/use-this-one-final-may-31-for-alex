
import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

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

interface CompactCategoryHeaderProps {
  category: EmailCategory;
  isExpanded: boolean;
  onHeaderClick: (e: React.MouseEvent) => void;
  onHeaderHover: () => void;
  onHeaderLeave: () => void;
}

const CompactCategoryHeader: React.FC<CompactCategoryHeaderProps> = ({
  category,
  isExpanded,
  onHeaderClick,
  onHeaderHover,
  onHeaderLeave
}) => {
  const { title, icon: Icon, unread, pending, total, bgColor, textColor } = category;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
      <div 
        className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onHeaderClick}
        onMouseEnter={onHeaderHover}
        onMouseLeave={onHeaderLeave}
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
  );
};

export default CompactCategoryHeader;
