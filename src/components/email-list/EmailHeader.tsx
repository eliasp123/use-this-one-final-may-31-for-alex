
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EmailHeaderProps {
  currentCategory: { 
    title: string; 
    color: string; 
    bgColor: string; 
  } | null;
  emailCount: number;
  activeTab: string;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({ 
  currentCategory, 
  emailCount, 
  activeTab 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <Button 
        variant="default" 
        size="sm" 
        className="mb-4 bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all duration-300"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-50">
        <div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            {currentCategory 
              ? `${currentCategory.title} Conversations` 
              : 'All Conversations'}
          </h1>
          
          <p className="text-sm text-gray-600 font-light">
            {emailCount} {emailCount === 1 ? 'conversation' : 'conversations'} 
            {activeTab !== 'all' ? ` - ${activeTab} messages` : ''}
          </p>
        </div>
        
        {currentCategory && (
          <div className={`px-4 py-2 rounded-xl ${currentCategory.bgColor} flex items-center shadow-sm`}>
            <span className={`w-3 h-3 rounded-full ${currentCategory.color.replace('bg-gradient-to-r', '')}`}></span>
            <span className="ml-2 text-sm font-medium text-gray-800">{currentCategory.title}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailHeader;
