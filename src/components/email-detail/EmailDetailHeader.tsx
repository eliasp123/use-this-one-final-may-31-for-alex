import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Home, Pencil, FileText } from 'lucide-react';
import { EmailData } from '../../types/email';
import { categoryInfo } from '../../utils/categoryUtils';
import DocumentHubPopup from './DocumentHubPopup';

interface EmailDetailHeaderProps {
  email: EmailData;
  onComposeClick: () => void;
}

const EmailDetailHeader: React.FC<EmailDetailHeaderProps> = ({ email, onComposeClick }) => {
  const navigate = useNavigate();
  const [showDocumentHub, setShowDocumentHub] = useState(false);
  
  // Determine status for display
  let statusBadge;
  if (!email.read) {
    statusBadge = <Badge className="bg-purple-500">Unread</Badge>;
  } else if (!email.replied) {
    statusBadge = <Badge className="bg-amber-500">Pending Reply</Badge>;
  } else if (!email.responseReceived) {
    statusBadge = <Badge className="bg-red-500">No Response Yet</Badge>;
  } else {
    statusBadge = <Badge className="bg-green-500">Completed</Badge>;
  }
  
  // Get info for current category
  const currentCategory = categoryInfo[email.category];
  
  return (
    <div className="pt-16 mb-8">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Button 
            size="sm"
            onClick={() => navigate(-1)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Conversation
          </Button>
          
          <Button 
            size="sm"
            onClick={() => navigate('/')}
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            <Home className="mr-1 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onComposeClick}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Compose New Email
          </Button>

          <Button 
            variant="default" 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowDocumentHub(true)}
          >
            <FileText className="mr-1 h-4 w-4" /> Document Hub
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800">
          {email.subject}
        </h1>
        
        <div className="flex items-center gap-2">
          {statusBadge}
          <div className={`px-3 py-1 rounded-lg ${currentCategory.bgColor} flex items-center`}>
            <span className={`w-2 h-2 rounded-full ${currentCategory.color.replace('bg-gradient-to-r', '')}`}></span>
            <span className="ml-2 text-xs font-medium text-gray-800">{currentCategory.title}</span>
          </div>
        </div>
      </div>
      
      {/* Document Hub Popup */}
      <DocumentHubPopup 
        isOpen={showDocumentHub}
        onClose={() => setShowDocumentHub(false)}
      />
    </div>
  );
};

export default EmailDetailHeader;
