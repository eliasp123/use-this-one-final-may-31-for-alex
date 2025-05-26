
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Plus, FileText } from 'lucide-react';

interface EmailHeaderProps {
  currentCategory: any;
  emailCount: number;
  activeTab: string;
  onComposeClick: () => void;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({
  currentCategory,
  emailCount,
  activeTab,
  onComposeClick
}) => {
  const navigate = useNavigate();

  const getStatusText = () => {
    switch (activeTab) {
      case 'unread': return 'Unread';
      case 'pending': return 'Pending Reply';
      case 'no-response': return 'No Response Yet';
      case 'completed': return 'Completed';
      default: return 'All';
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          {currentCategory ? currentCategory.title : 'All Categories'} Emails
        </h1>
        <p className="text-gray-600">
          {emailCount} {getStatusText().toLowerCase()} email{emailCount !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/documents')}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Back to Document Hub
        </Button>
        
        <Button
          onClick={onComposeClick}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Compose Email
        </Button>
      </div>
    </div>
  );
};

export default EmailHeader;
