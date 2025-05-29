
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { EmailData } from '../../types/email';
import { getAllCategories } from '../../utils/categoryUtils';
import IndexActionButtons from '../../pages/IndexActionButtons';

interface EmailDetailHeaderProps {
  email: EmailData;
}

const EmailDetailHeader: React.FC<EmailDetailHeaderProps> = ({ email }) => {
  const navigate = useNavigate();
  const allCategories = getAllCategories();
  const categoryInfo = allCategories[email.category];
  
  return (
    <div className="mb-6">
      <div className="flex justify-start mb-8">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          {categoryInfo ? categoryInfo.title : 'Unknown Category'} Emails
        </h1>
        <p className="text-gray-600">
          Email thread with {email.sender.name}
        </p>
        
        <IndexActionButtons
          onNewEmail={() => {/* This will be handled by existing form */}}
          onViewDocuments={() => navigate('/documents')}
          onCalendarClick={() => {
            const calendarSection = document.getElementById('calendar-section');
            if (calendarSection) {
              calendarSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>
    </div>
  );
};

export default EmailDetailHeader;
