
import React from 'react';
import { Pencil, FileText, Calendar } from 'lucide-react';

interface IndexActionButtonsProps {
  onNewEmail: () => void;
  onViewDocuments: () => void;
  onCalendarClick: () => void;
}

const IndexActionButtons: React.FC<IndexActionButtonsProps> = ({
  onNewEmail,
  onViewDocuments,
  onCalendarClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-6 mt-6 sm:mt-8 w-full max-w-2xl">
      <button
        onClick={onNewEmail}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <div className="flex items-center">
          <Pencil className="mr-2 h-4 w-4" />
          <span className="font-medium">Compose New Email</span>
        </div>
      </button>
      
      <button
        onClick={onViewDocuments}
        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
      >
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          <span className="font-medium">View Documents</span>
        </div>
      </button>
      
      <button
        onClick={onCalendarClick}
        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="font-medium">Calendar</span>
        </div>
      </button>
    </div>
  );
};

export default IndexActionButtons;
