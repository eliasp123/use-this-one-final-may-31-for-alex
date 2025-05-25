
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import EmailCategoryCard from '../EmailCategoryCard';

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

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleHeaderHover = () => {
    setIsExpanded(true);
  };

  const handleHeaderLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div className="space-y-0">
      {/* Compact Header - with hover activation and matching row 1 styling */}
      <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
        <div 
          className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={handleCardClick}
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
            
            <div className="p-1">
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full Card - without duplicate header */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'max-h-96 opacity-100 mt-4' 
            : 'max-h-0 opacity-0 mt-0'
        }`}
        onMouseEnter={handleHeaderHover}
        onMouseLeave={handleHeaderLeave}
      >
        <div className="animate-fade-in px-4 sm:px-6">
          {/* Custom card content without the header since it's already shown above */}
          <div 
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px]"
            onClick={handleCardClick}
          >
            {/* Stats - same as EmailCategoryCard but without header */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <span className="text-gray-600">Unread messages</span>
                <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${unread > 0 ? 'bg-purple-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                  {unread > 0 ? unread : "-"}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <span className="text-gray-600">Pending replies</span>
                <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${pending > 0 ? 'bg-amber-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
                  {pending > 0 ? pending : "-"}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <span className="text-gray-600">Has not responded yet</span>
                <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105">
                  {/* Using a placeholder count for now */}
                  {pending > 0 ? pending : "-"}
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
  );
};

export default CompactCategoryItem;
