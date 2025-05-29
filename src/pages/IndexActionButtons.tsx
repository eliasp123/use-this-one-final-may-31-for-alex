import React from 'react';
import { Pencil, FileText, Calendar, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IndexActionButtonsProps {
  onNewEmail: () => void;
  onViewDocuments: () => void;
  onCalendarClick: () => void;
}

const IndexActionButtons = ({ onNewEmail, onViewDocuments, onCalendarClick }: IndexActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <button
        onClick={onNewEmail}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
      >
        <Mail className="h-4 w-4" />
        Compose
      </button>
      
      <button
        onClick={onViewDocuments}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium"
      >
        <FileText className="h-4 w-4" />
        Documents
      </button>

      <button
        onClick={() => navigate('/map')}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-full shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
      >
        <MapPin className="h-4 w-4" />
        Find Care
      </button>
      
      <button
        onClick={onCalendarClick}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2.5 rounded-full shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-sm font-medium"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </button>
    </div>
  );
};

export default IndexActionButtons;
