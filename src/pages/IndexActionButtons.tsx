
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
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={onNewEmail}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
      >
        <Mail className="h-4 w-4" />
        Compose
      </button>
      
      <button
        onClick={onViewDocuments}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm font-medium"
      >
        <FileText className="h-4 w-4" />
        Documents
      </button>

      <button
        onClick={() => navigate('/map')}
        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm font-medium"
      >
        <MapPin className="h-4 w-4" />
        Find Care
      </button>
      
      <button
        onClick={onCalendarClick}
        className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors duration-200 text-sm font-medium"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </button>
    </div>
  );
};

export default IndexActionButtons;
