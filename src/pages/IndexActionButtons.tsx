
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
    <div className="flex items-center justify-center gap-8 mt-8">
      <button
        onClick={onNewEmail}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base font-medium underline decoration-gray-300 hover:decoration-blue-600 underline-offset-4"
      >
        <Mail className="h-4 w-4" />
        Compose
      </button>
      
      <button
        onClick={onViewDocuments}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200 text-base font-medium underline decoration-gray-300 hover:decoration-green-600 underline-offset-4"
      >
        <FileText className="h-4 w-4" />
        Documents
      </button>

      <button
        onClick={() => navigate('/map')}
        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 text-base font-medium underline decoration-gray-300 hover:decoration-purple-600 underline-offset-4"
      >
        <MapPin className="h-4 w-4" />
        Find Care
      </button>
      
      <button
        onClick={onCalendarClick}
        className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors duration-200 text-base font-medium underline decoration-gray-300 hover:decoration-amber-600 underline-offset-4"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </button>
    </div>
  );
};

export default IndexActionButtons;
