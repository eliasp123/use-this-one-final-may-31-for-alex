
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Pencil, Mail, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import CalendarPopup from '../CalendarPopup';

interface DocumentsHeaderProps {
  onNewEmailClick: () => void;
}

const DocumentsHeader = ({ onNewEmailClick }: DocumentsHeaderProps) => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="text-center mb-8 sm:mb-16">
      <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mb-2 sm:mb-4">Document Hub</h1>
      <p className="text-sm sm:text-base text-gray-600 font-light">Manage and organize your email attachments</p>
      
      <div className="mt-6 sm:mt-8 flex gap-3 justify-center">
        <Button
          onClick={onNewEmailClick}
          className="w-64 bg-green-500 hover:bg-green-600 text-white px-6 py-3 h-12 rounded-lg font-medium flex items-center justify-center"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Compose New Email
        </Button>
        
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-64 px-6 py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center text-base"
        >
          <Mail className="mr-2 h-4 w-4" />
          Return to Communication Hub
        </Button>

        <Button
          onClick={() => setShowCalendar(true)}
          variant="outline"
          className="w-64 px-6 py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center text-base"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </div>

      {/* Calendar Popup */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <CalendarPopup showTrigger={false} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsHeader;
