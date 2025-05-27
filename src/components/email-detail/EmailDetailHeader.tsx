
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { EmailData } from '../../types/email';
import { getAllCategories } from '../../utils/categoryUtils';

interface EmailDetailHeaderProps {
  email: EmailData;
}

const EmailDetailHeader: React.FC<EmailDetailHeaderProps> = ({ email }) => {
  const navigate = useNavigate();
  const allCategories = getAllCategories();
  const categoryInfo = allCategories[email.category];
  
  // Debug logging
  console.log('Email category:', email.category);
  console.log('Category info:', categoryInfo);
  console.log('Category title:', categoryInfo?.title);
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          <span className="font-semibold text-gray-700">Conversation:</span>{' '}
          {categoryInfo ? categoryInfo.title : 'Unknown Category'}
        </h1>
        <p className="text-gray-600">
          Email thread with {email.sender.name}
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Communication Hub
        </Button>
      </div>
    </div>
  );
};

export default EmailDetailHeader;
