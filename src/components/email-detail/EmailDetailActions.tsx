
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Reply, CheckCircle, Clock, Lock, Unlock, FileText, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { EmailData } from '../../types/email';
import { categoryInfo } from '../../utils/categoryUtils';
import { useToast } from '../../hooks/use-toast';
import { useScrollBehavior } from '../../hooks/useScrollBehavior';
import Documents from '../../pages/Documents';

interface EmailDetailActionsProps {
  email: EmailData;
  onReplyClick: () => void;
  onMarkAsReplied: () => void;
  onMarkAsResponseReceived: () => void;
  onMarkAsPrivate: () => void;
  showReplyForm: boolean;
}

const EmailDetailActions: React.FC<EmailDetailActionsProps> = ({
  email,
  onReplyClick,
  onMarkAsReplied,
  onMarkAsResponseReceived,
  onMarkAsPrivate,
  showReplyForm
}) => {
  const navigate = useNavigate();
  const currentCategory = categoryInfo[email.category];
  const [showDocumentHub, setShowDocumentHub] = useState(false);
  const { toast } = useToast();
  
  // Use scroll behavior hook for centering view when accordion opens
  const { containerRef } = useScrollBehavior(showDocumentHub);
  
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

      {/* Document Hub Accordion */}
      <div ref={containerRef}>
        <Collapsible open={showDocumentHub} onOpenChange={setShowDocumentHub}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-300 w-full justify-between"
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Document Hub
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDocumentHub ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <Documents />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default EmailDetailActions;
