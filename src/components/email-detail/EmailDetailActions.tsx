
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Reply, CheckCircle, Clock } from 'lucide-react';
import { EmailData } from '../../types/email';
import { categoryInfo } from '../../utils/categoryUtils';

interface EmailDetailActionsProps {
  email: EmailData;
  onReplyClick: () => void;
  onMarkAsReplied: () => void;
  onMarkAsResponseReceived: () => void;
  showReplyForm: boolean;
}

const EmailDetailActions: React.FC<EmailDetailActionsProps> = ({
  email,
  onReplyClick,
  onMarkAsReplied,
  onMarkAsResponseReceived,
  showReplyForm
}) => {
  const navigate = useNavigate();
  const currentCategory = categoryInfo[email.category];
  
  return (
    <div className="flex flex-wrap gap-3 justify-start">
      <Button 
        className="bg-green-500 hover:bg-green-600"
        onClick={onReplyClick}
        disabled={showReplyForm}
      >
        <Reply className="mr-1 h-4 w-4" /> Reply
      </Button>
      
      {!email.replied && (
        <Button variant="outline" onClick={onMarkAsReplied}>
          <CheckCircle className="mr-1 h-4 w-4" /> Mark as Replied
        </Button>
      )}
      
      {email.replied && !email.responseReceived && (
        <Button variant="outline" onClick={onMarkAsResponseReceived}>
          <Clock className="mr-1 h-4 w-4" /> Mark Response Received
        </Button>
      )}
      
      <Button variant="outline" onClick={() => navigate(`/emails/${email.category}/all`)}>
        View All {currentCategory.title} Emails
      </Button>
    </div>
  );
};

export default EmailDetailActions;
