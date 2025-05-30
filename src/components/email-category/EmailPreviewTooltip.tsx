
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailData } from '@/types/email';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Calendar, User, Building2, Plus, Clock, MapPin } from 'lucide-react';
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
  hoveredDate
}) => {
  const navigate = useNavigate();

  const handleEmailClick = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    
    if (isEmailRowTooltip) {
      navigate(`/email/${emailId}`);
    } else {
      navigate(`/emails/${category}/${status}`);
    }
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

  // Position the tooltip with smart positioning
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.max(10, Math.min(position.x, window.innerWidth - 340)),
    top: Math.max(10, Math.min(position.y, window.innerHeight - 400)),
    zIndex: 9999,
  };

  const isAppointmentCategory = category === "appointments";

  return (
    <div 
      className="bg-white rounded-xl shadow-2xl border border-gray-200 min-w-[320px] max-w-[340px] max-h-[400px] overflow-hidden"
      style={tooltipStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isAppointmentCategory && hoveredDate ? (
        // Appointment-specific design matching the image
        <>
          {/* Header with date and count */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-800">
                  {formatDateHeader(hoveredDate)}
                </h3>
                <p className="text-sm text-gray-500">
                  {emails.length === 1 ? '1 Appointment' : `${emails.length} Appointments`}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-lg font-medium ml-2"
              >
                ×
              </button>
            </div>
          </div>

          {/* Add Appointment Button */}
          <div className="p-3 bg-orange-50 border-b border-orange-100">
            <Button
              onClick={handleAddAppointmentClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              + Make An Appointment
            </Button>
          </div>

          {/* Appointments List with ScrollArea */}
          <div className="h-[260px]">
            <ScrollArea className="h-full">
              {emails.length > 0 ? (
                <div className="space-y-0">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        index < emails.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      onClick={(e) => handleEmailClick(email.id, e)}
                    >
                      {/* Appointment Title */}
                      <div className="mb-2">
                        <h4 className="text-base text-amber-700 mb-1">
                          {email.subject}
                        </h4>
                      </div>

                      {/* Time and Location */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(email.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{email.sender.organization}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-amber-50 p-2 rounded text-xs text-amber-800">
                        {email.content.length > 80 ? 
                          `${email.content.substring(0, 80)}...` : 
                          email.content
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30 text-orange-400" />
                  <p className="text-sm text-gray-500">
                    No appointments found
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      ) : (
        // Enhanced email design with better visual separation
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {status === 'unread' ? 'Unread Messages' :
                     status === 'pending' ? 'Pending Replies' :
                     'No Response Yet'}
                  </span>
                  <p className="text-xs text-gray-500">
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

          {/* Content List with ScrollArea */}
          <div className="h-[280px]">
            <ScrollArea className="h-full">
              {emails.length > 0 ? (
                <div className="space-y-0">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        index < emails.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      onClick={(e) => handleEmailClick(email.id, e)}
                    >
                      {/* Email Subject */}
                      <div className="mb-2">
                        <h4 className="text-base text-amber-700 mb-1">
                          {email.subject}
                        </h4>
                      </div>

                      {/* Sender and Organization */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{email.sender.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{email.sender.organization}</span>
                        </div>
                      </div>

                      {/* Email Preview - 4 sentences */}
                      <div className="bg-amber-50 p-2 rounded text-xs text-gray-600">
                        {getEmailPreview(email.content)}
                      </div>

                      {/* Date */}
                      <div className="flex justify-end mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(email.date), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="text-sm text-gray-500">
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
