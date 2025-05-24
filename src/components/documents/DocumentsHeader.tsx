
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Pencil, Mail } from 'lucide-react';

interface DocumentsHeaderProps {
  onNewEmailClick: () => void;
}

const DocumentsHeader = ({ onNewEmailClick }: DocumentsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8 sm:mb-16">
      <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mb-2 sm:mb-4">Document Hub</h1>
      <p className="text-sm sm:text-base text-gray-600 font-light">Manage and organize your email attachments</p>
      
      <div className="mt-6 sm:mt-8 flex gap-3 justify-center">
        <Button
          onClick={onNewEmailClick}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Compose New Email
        </Button>
        
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="px-6 py-3 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
        >
          <Mail className="mr-2 h-4 w-4" />
          Return to Communication Hub
        </Button>
      </div>
    </div>
  );
};

export default DocumentsHeader;
