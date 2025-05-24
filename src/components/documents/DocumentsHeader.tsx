
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Pencil, Mail, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
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
          className="w-64 px-6 py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center"
        >
          <Mail className="mr-2 h-4 w-4" />
          Return to Communication Hub
        </Button>

        <Button
          onClick={() => setShowCalendar(true)}
          variant="outline"
          className="w-64 px-6 py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </div>

      {/* Calendar Popup */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center text-2xl font-semibold text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Calendar
            </DialogTitle>
          </DialogHeader>
          <CalendarPopup showTrigger={false} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsHeader;
