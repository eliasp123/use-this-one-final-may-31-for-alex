
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

interface EmailCategoryCardProps {
  category: EmailCategory;
}

const EmailCategoryCard: React.FC<EmailCategoryCardProps> = ({ category }) => {
  const { id, title, icon: Icon, unread, pending, total, color, bgColor, textColor } = category;
  const navigate = useNavigate();
  
  // Always show not responded line with 1 or 2 count
  const notRespondedCount = Math.floor(Math.random() * 2) + 1; // Random count of 1 or 2
  
  const handleCardClick = () => {
    navigate(`/emails/${id}/all`);
  };
  
  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/emails/${id}/${status}`);
  };
  
  return (
    <div 
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-4px]"
      onClick={handleCardClick}
    >
      {/* Header - Restructured to have icon and title on the same row */}
      <div className="flex items-center mb-6 sm:mb-8">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${textColor} group-hover:animate-pulse`} />
        </div>
        
        {/* Title next to the icon with New ribbon */}
        <div className="flex items-center ml-3 sm:ml-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{title}</h3>
          
          {/* New ribbon - shows when there are unread messages */}
          {unread > 0 && (
            <div className="ml-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              NEW
            </div>
          )}
        </div>
      </div>

      {/* Stats - Now with colored circles in the rows - adjusted to be 15% larger than the reduced size */}
      <div className="space-y-4 sm:space-y-5">
        <div 
          className="flex items-center justify-between text-xs sm:text-sm"
          onClick={(e) => handleStatusClick('unread', e)}
        >
          <span className="text-gray-600">Unread messages</span>
          <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${unread > 0 ? 'bg-purple-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
            {unread > 0 ? unread : "-"}
          </div>
        </div>
        
        <div 
          className="flex items-center justify-between text-xs sm:text-sm"
          onClick={(e) => handleStatusClick('pending', e)}
        >
          <span className="text-gray-600">Pending replies</span>
          <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ${pending > 0 ? 'bg-amber-500' : 'bg-gray-300'} rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105`}>
            {pending > 0 ? pending : "-"}
          </div>
        </div>
        
        <div 
          className="flex items-center justify-between text-xs sm:text-sm"
          onClick={(e) => handleStatusClick('unresponded', e)}
        >
          <span className="text-gray-600">Has not responded yet</span>
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full text-white text-xs font-medium transition-transform group-hover:scale-105">
            {notRespondedCount}
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
  );
};

export default EmailCategoryCard;
