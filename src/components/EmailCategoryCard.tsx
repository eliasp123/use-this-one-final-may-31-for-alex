
import React from 'react';
import { LucideIcon } from 'lucide-react';

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
  const { title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  
  // Always show not responded line with 1 or 2 count
  const notRespondedCount = Math.floor(Math.random() * 2) + 1; // Random count of 1 or 2
  
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${textColor} group-hover:animate-pulse`} />
        </div>
        
        {/* Status indicators - Changed unread indicator to purple */}
        <div className="flex space-x-2">
          {unread > 0 && (
            <div className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center group-hover:scale-105 transition-transform">
              {unread}
            </div>
          )}
          {pending > 0 && (
            <div className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center group-hover:scale-105 transition-transform">
              {pending}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4 sm:mb-6 group-hover:text-gray-900 transition-colors">{title}</h3>

      {/* Stats - Always show all three lines with increased spacing and no separators */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">Unread messages</span>
          <span className="font-medium text-purple-600">{unread > 0 ? unread : "-"}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">Pending replies</span>
          <span className="font-medium text-amber-600">{pending > 0 ? pending : "-"}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">Has not responded yet</span>
          <span className="font-medium text-red-600">{notRespondedCount}</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 sm:mt-6">
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
      <div className={`flex items-center justify-between text-xs sm:text-sm mt-8 sm:mt-10 p-2 rounded-lg bg-gradient-to-r ${color} group-hover:shadow-lg transition-shadow`}>
        <span className="text-white font-medium">Total conversations</span>
        <span className="text-white font-bold">{total}</span>
      </div>
    </div>
  );
};

export default EmailCategoryCard;
