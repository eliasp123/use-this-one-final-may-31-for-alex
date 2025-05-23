
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Separator } from './ui/separator';

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
  
  // Calculate if we have any stats to display (to know if we need separators)
  const hasAnyStats = unread > 0 || pending > 0 || true; // Always true now as we always show not responded

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-7 h-7 ${textColor}`} />
        </div>
        
        {/* Status indicators - Changed unread indicator to purple */}
        <div className="flex space-x-2">
          {unread > 0 && (
            <div className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
              {unread}
            </div>
          )}
          {pending > 0 && (
            <div className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
              {pending}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-800 mb-6">{title}</h3>

      {/* Stats */}
      <div className="space-y-4">
        {unread > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Unread messages</span>
              <span className="font-medium text-purple-600">{unread}</span>
            </div>
            {(pending > 0 || true) && <Separator className="my-1" />}
          </>
        )}
        
        {pending > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pending replies</span>
              <span className="font-medium text-amber-600">{pending}</span>
            </div>
            <Separator className="my-1" />
          </>
        )}
        
        {/* Always show the Has not responded yet line with a count of 1 or 2 */}
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Has not responded yet</span>
            <span className="font-medium text-red-600">{notRespondedCount}</span>
          </div>
        </>
        
        <div className={`flex items-center justify-between text-sm ${hasAnyStats ? 'pt-2 border-t-2 border-gray-300' : ''}`}>
          <span className="text-gray-600">Total conversations</span>
          <span className="font-medium text-gray-800">{total}</span>
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
  );
};

export default EmailCategoryCard;
