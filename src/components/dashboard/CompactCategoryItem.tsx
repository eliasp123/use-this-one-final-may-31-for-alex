
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

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
        <div 
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
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
      </div>

      {/* Expanded Full Card */}
      {isExpanded && (
        <div className="pl-4">
          <EmailCategoryCard category={category} />
        </div>
      )}
    </div>
  );
};

export default CompactCategoryItem;
