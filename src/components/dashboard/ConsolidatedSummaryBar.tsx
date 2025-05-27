
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ConsolidatedSummaryBarProps {
  totalUnread: number;
  totalPending: number;
  totalUnresponded: number;
}

const ConsolidatedSummaryBar: React.FC<ConsolidatedSummaryBarProps> = ({ 
  totalUnread, 
  totalPending, 
  totalUnresponded 
}) => {
  const navigate = useNavigate();
  
  const handleSectionClick = (status: string) => {
    navigate(`/emails/all/${status}`);
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto mb-8 sm:mb-12">
      <div className="flex items-stretch h-16">
        {/* Single card containing all summary metrics */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg flex items-stretch w-full">
          {/* Summary label with purple background */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-500 text-white flex-1 rounded-l-2xl flex items-center justify-center h-full">
            <span className="font-medium">Summary:</span>
          </div>

          {/* Unread Messages */}
          <button
            onClick={() => handleSectionClick('unread')}
            className="flex items-center justify-center flex-[3] transition-all duration-200 h-full bg-white hover:bg-gray-50 text-gray-700"
          >
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium">Unread Messages</span>
              <div className={`flex items-center justify-center w-6 h-6 ${
                totalUnread > 0 ? 'bg-purple-500' : 'bg-gray-300'
              } rounded-full text-white text-sm font-bold`}>
                {totalUnread}
              </div>
            </div>
          </button>

          {/* Pending Replies */}
          <button
            onClick={() => handleSectionClick('pending')}
            className="flex items-center justify-center flex-[3] transition-all duration-200 h-full bg-white hover:bg-gray-50 text-gray-700"
          >
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium">Pending Replies</span>
              <div className={`flex items-center justify-center w-6 h-6 ${
                totalPending > 0 ? 'bg-amber-500' : 'bg-gray-300'
              } rounded-full text-white text-sm font-bold`}>
                {totalPending}
              </div>
            </div>
          </button>

          {/* Has Not Responded Yet */}
          <button
            onClick={() => handleSectionClick('unresponded')}
            className="flex items-center justify-center flex-[3] transition-all duration-200 h-full bg-white hover:bg-gray-50 text-gray-700 rounded-r-2xl"
          >
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium">Has Not Responded Yet</span>
              <div className={`flex items-center justify-center w-6 h-6 ${
                totalUnresponded > 0 ? 'bg-red-500' : 'bg-gray-300'
              } rounded-full text-white text-sm font-bold`}>
                {totalUnresponded}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedSummaryBar;
