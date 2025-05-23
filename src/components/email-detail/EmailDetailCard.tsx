
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { EmailData } from '../../types/email';

interface EmailDetailCardProps {
  email: EmailData;
}

const EmailDetailCard: React.FC<EmailDetailCardProps> = ({ email }) => {
  // Helper function to format date in a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Email header info */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-medium">{email.sender.name}</h3>
              <p className="text-gray-600">{email.sender.organization}</p>
              <p className="text-sm text-gray-500">{email.sender.email}</p>
            </div>
            
            <p className="text-sm text-gray-500">
              {formatDate(email.date)}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <span>To: {email.recipient}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Email content */}
        <div className="py-4 whitespace-pre-line text-gray-700">
          {email.content}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailDetailCard;
