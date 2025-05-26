
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Reply, CheckCircle, Clock, Lock, Unlock } from 'lucide-react';
import { EmailData } from '../../types/email';
import { categoryInfo } from '../../utils/categoryUtils';

interface EmailDetailActionsProps {
  email: EmailData;
  onReplyClick: () => void;
  onMarkAsReplied: () => void;
  onMarkAsResponseReceived: () => void;
  onMarkAsPrivate: () => void;
  onComposeClick: () => void;
  showReplyForm: boolean;
}

const EmailDetailActions: React.FC<EmailDetailActionsProps> = ({
  email,
  onReplyClick,
  onMarkAsReplied,
  onMarkAsResponseReceived,
  onMarkAsPrivate,
  onComposeClick,
  showReplyForm
}) => {
  const navigate = useNavigate();
  const currentCategory = categoryInfo[email.category];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-start">
        <Button 
          className="bg-green-500 hover:bg-green-600"
          onClick={onReplyClick}
          disabled={showReplyForm}
        >
          <Reply className="mr-1 h-4 w-4" /> Reply
        </Button>
        
        <Button
          onClick={onComposeClick}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Reply className="mr-2 h-4 w-4" />
          Compose New Email
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
        
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={onMarkAsPrivate}
        >
          {email.private ? (
            <>
              <Unlock className="mr-1 h-4 w-4" /> Remove Private
            </>
          ) : (
            <>
              <Lock className="mr-1 h-4 w-4" /> Mark Private
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={() => navigate(`/emails/${email.category}/all`)}>
          View All {currentCategory.title} Emails
        </Button>
      </div>
    </div>
  );
};

export default EmailDetailActions;
