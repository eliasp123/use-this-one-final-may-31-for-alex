
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailData } from '@/types/email';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Calendar, User, Building2, Plus, Clock, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';

interface EmailPreviewTooltipProps {
  emails: EmailData[];
  status: 'unread' | 'pending' | 'unresponded';
  category: string;
  position: { x: number; y: number };
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
  categoryColor: string;
  isEmailRowTooltip?: boolean;
  onAddAppointment?: (date: Date) => void;
  hoveredDate?: Date;
  autoFade?: boolean;
}

const EmailPreviewTooltip: React.FC<EmailPreviewTooltipProps> = ({
  emails,
  status,
  category,
  position,
  onClose,
  onMouseEnter,
  onMouseLeave,
  categoryColor,
  isEmailRowTooltip = false,
  onAddAppointment,
  hoveredDate,
  autoFade = false
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-fade functionality
    let fadeTimer: NodeJS.Timeout | null = null;
    
    if (autoFade) {
      fadeTimer = setTimeout(() => {
        onClose();
      }, 1000); // Auto-fade after 1 second for top row tooltips
    }
    
    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [autoFade, onClose]);

  const handleEmailClick = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    
    // Always navigate to the email list page (top of email summary)
    navigate(`/emails/${category}/${status}`);
  };

  const handleAddAppointmentClick = () => {
    onClose();
    if (onAddAppointment && hoveredDate) {
      onAddAppointment(hoveredDate);
    } else {
      console.log('Add appointment clicked from email preview');
    }
  };

  const formatDateHeader = (date: Date) => {
    return format(date, 'EEEE, MMMM do');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  // Function to get first 4 sentences from content
  const getEmailPreview = (content: string) => {
    const sentences = content.match(/[^\.!?]+[\.!?]+/g) || [];
    const preview = sentences.slice(0, 4).join(' ');
    return preview.length > 200 ? `${preview.substring(0, 200)}...` : preview;
  };

  // Position the tooltip above the date with smart positioning
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.max(10, Math.min(position.x - 160, window.innerWidth - 340)), // Center horizontally on the date
    top: Math.max(10, position.y - 320), // Reduced height positioning
    zIndex: 9999,
  };

  const isAppointmentCategory = category === "appointments";

  return (
    <div 
      className="bg-white rounded-xl shadow-2xl border border-gray-200 min-w-[320px] max-w-[340px] max-h-[280px] overflow-hidden"
      style={tooltipStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isAppointmentCategory && hoveredDate ? (
        // Appointment-specific design with proper spacing
        <>
          {/* Header with date and count */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {formatDateHeader(hoveredDate)}
                </h3>
                <p className="text-xs text-gray-500">
                  {emails.length === 1 ? '1 Appointment' : `${emails.length} Appointments`}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-lg font-medium"
              >
                ×
              </button>
            </div>
          </div>

          {/* Add Appointment Button */}
          <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
            <Button
              onClick={handleAddAppointmentClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              + Make An Appointment
            </Button>
          </div>

          {/* Appointments List with proper spacing */}
          <div className="h-[180px]">
            <ScrollArea className="h-full">
              {emails.length > 0 ? (
                <div className="space-y-3 p-4">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded border-b border-gray-100 last:border-b-0"
                      onClick={(e) => handleEmailClick(email.id, e)}
                    >
                      {/* Appointment Title with proper spacing */}
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-amber-700 leading-relaxed">
                          {email.subject}
                        </h4>
                      </div>

                      {/* Time and Location with proper spacing */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(email.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{email.sender.organization}</span>
                        </div>
                      </div>

                      {/* Summary with proper spacing */}
                      <div className="bg-amber-50 px-3 py-2 rounded text-xs text-amber-800 leading-relaxed">
                        {email.content.length > 80 ? 
                          `${email.content.substring(0, 80)}...` : 
                          email.content
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30 text-orange-400" />
                  <p className="text-xs text-gray-500">
                    No appointments found
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      ) : (
        // Enhanced email design with proper spacing
        <>
          {/* Header with Close button */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {status === 'unread' ? 'Unread Messages' :
                     status === 'pending' ? 'Pending Replies' :
                     'No Response Yet'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {emails.length === 1 ? '1 email' : `${emails.length} emails`}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-lg font-medium"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content List with proper spacing */}
          <div className="h-[200px]">
            <ScrollArea className="h-full">
              {emails.length > 0 ? (
                <div className="space-y-3 p-4">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded border-b border-gray-100 last:border-b-0"
                      onClick={(e) => handleEmailClick(email.id, e)}
                    >
                      {/* Email Subject with proper spacing */}
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-amber-700 leading-relaxed">
                          {email.subject}
                        </h4>
                      </div>

                      {/* Sender, Organization and Date with proper spacing */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{email.sender.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Building2 className="w-3 h-3" />
                          <span>{email.sender.organization}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(email.date), 'MMM d')}</span>
                        </div>
                      </div>

                      {/* Email Preview with proper spacing and line height */}
                      <div className="bg-amber-50 px-3 py-2 rounded text-xs text-gray-600 leading-relaxed">
                        {getEmailPreview(email.content)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    No emails found
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailPreviewTooltip;
