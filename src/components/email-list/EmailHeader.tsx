import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, FileText, Calendar } from 'lucide-react';
import DocumentHubPopup from '../email-detail/DocumentHubPopup';
import CalendarPopup from '../CalendarPopup';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface EmailHeaderProps {
  currentCategory: { 
    title: string; 
    color: string; 
    bgColor: string; 
  } | null;
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
  const [showDocumentHub, setShowDocumentHub] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-300"
          onClick={() => setShowDocumentHub(true)}
        >
          <FileText className="mr-1 h-4 w-4" /> Document Hub
        </Button>

        <Button 
          variant="default" 
          size="sm" 
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all duration-300"
          onClick={() => setShowCalendar(true)}
        >
          <Calendar className="mr-1 h-4 w-4" /> Calendar
        </Button>
      </div>
      
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
        
        <div className="flex items-center gap-4">
          <Button
            onClick={onComposeClick}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Compose New Email
          </Button>
          
          {currentCategory && (
            <div className={`px-4 py-2 rounded-xl ${currentCategory.bgColor} flex items-center shadow-sm`}>
              <span className={`w-3 h-3 rounded-full ${currentCategory.color.replace('bg-gradient-to-r', '')}`}></span>
              <span className="ml-2 text-sm font-medium text-gray-800">{currentCategory.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Document Hub Popup */}
      <DocumentHubPopup 
        isOpen={showDocumentHub}
        onClose={() => setShowDocumentHub(false)}
      />

      {/* Calendar Popup */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <CalendarPopup showTrigger={false} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailHeader;
