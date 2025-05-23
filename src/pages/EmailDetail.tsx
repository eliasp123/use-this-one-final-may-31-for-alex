
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { getEmailById } from '../data/emailData';
import { EmailData } from '../types/email';
import EmailDetailHeader from '../components/email-detail/EmailDetailHeader';
import EmailDetailCard from '../components/email-detail/EmailDetailCard';
import EmailDetailActions from '../components/email-detail/EmailDetailActions';
import EmailReplyForm from '../components/EmailReplyForm';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState<EmailData | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundEmail = getEmailById(id);
      if (foundEmail) {
        setEmail(foundEmail);
        
        // In a real app, we would mark it as read on the server
        // For this mock, we'll just update the local state
        if (!foundEmail.read) {
          foundEmail.read = true;
        }
      }
    }
  }, [id]);
  
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Email not found</h2>
          <p className="mb-4">The email you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  // In a real app, these functions would communicate with a backend
  const handleMarkAsReplied = () => {
    if (email) {
      email.replied = true;
      // Force a re-render
      setEmail({...email});
    }
  };
  
  const handleMarkAsResponseReceived = () => {
    if (email) {
      email.responseReceived = true;
      // Force a re-render
      setEmail({...email});
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(true);
  };

  const handleReplyClose = () => {
    setShowReplyForm(false);
  };

  const handleReplySend = (replyData: any) => {
    // This will be connected to Nylas later
    console.log('Reply sent:', replyData);
    
    // Update email status
    if (email) {
      email.replied = true;
      setEmail({...email});
    }
    
    setShowReplyForm(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <EmailDetailHeader email={email} />
        
        <EmailDetailCard email={email} />
        
        <EmailDetailActions
          email={email}
          onReplyClick={handleReplyClick}
          onMarkAsReplied={handleMarkAsReplied}
          onMarkAsResponseReceived={handleMarkAsResponseReceived}
          showReplyForm={showReplyForm}
        />
        
        {/* Reply Form */}
        {showReplyForm && (
          <EmailReplyForm
            originalEmail={email}
            onClose={handleReplyClose}
            onSend={handleReplySend}
          />
        )}
      </div>
    </div>
  );
};

export default EmailDetail;
