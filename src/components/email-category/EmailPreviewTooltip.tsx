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
  position: { 
    x: number; 
    y: number; 
    cardWidth?: number; 
    cardTop?: number; 
    cardRight?: number;
    cardHeight?: number;
  };
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
  categoryColor: string;
  isEmailRowTooltip?: boolean;
  onAddAppointment?: (date: Date) => void;
  hoveredDate?: Date;
  autoFade?: boolean;
  categoryCardWidth?: number;
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
  autoFade = false,
  categoryCardWidth = 400
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

  // Perfect dynamic sizing based on email count
  const getTooltipDimensions = () => {
    const baseWidth = 420;
    const headerHeight = 60;
    const emailItemHeight = emails.length === 1 ? 120 : 140;
    const padding = 20;
    
    const emailCount = emails.length;
    const contentHeight = emailItemHeight * Math.min(emailCount, 3); // Show max 3 emails before scrolling
    const totalHeight = headerHeight + contentHeight + padding;
    
    return {
      width: baseWidth,
      height: Math.min(totalHeight, 500) // Reasonable max height
    };
  };

  const { width: tooltipWidth, height: tooltipHeight } = getTooltipDimensions();
  const screenWidth = window.innerWidth;
  
  // Perfect edge alignment - slide from category card edge
  const cardLeft = position.x;
  const cardRight = position.cardRight || (position.x + categoryCardWidth);
  const cardTop = position.cardTop || position.y;
  const cardHeight = position.cardHeight || 200;
  
  // Determine slide direction based on available space
  const spaceOnRight = screenWidth - cardRight;
  const spaceOnLeft = cardLeft;
  const shouldSlideLeft = spaceOnRight < tooltipWidth + 20 && spaceOnLeft > tooltipWidth + 20;
  
  let finalLeft: number;
  let finalTop: number;
  
  if (shouldSlideLeft) {
    // Slide out to the left - align tooltip's RIGHT edge with card's LEFT edge
    finalLeft = cardLeft - tooltipWidth;
  } else {
    // Slide out to the right - align tooltip's LEFT edge with card's RIGHT edge
    finalLeft = cardRight;
  }
  
  // Perfect height alignment - tooltip top aligns with card top
  finalTop = cardTop;
  
  // Ensure tooltip stays within screen bounds
  finalLeft = Math.max(10, Math.min(finalLeft, screenWidth - tooltipWidth - 10));
  finalTop = Math.max(10, Math.min(finalTop, window.innerHeight - tooltipHeight - 10));

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: finalLeft,
    top: finalTop,
    width: tooltipWidth,
    height: tooltipHeight,
    zIndex: 9999,
    transform: shouldSlideLeft ? 'translateX(-10px)' : 'translateX(10px)',
    animation: 'slideIn 0.2s ease-out forwards'
  };

  const isAppointmentCategory = category === "appointments";

  return (
    <div 
      className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ease-out"
      style={tooltipStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: ${shouldSlideLeft ? 'translateX(10px)' : 'translateX(-10px)'};
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}
      </style>
      
      {isAppointmentCategory && hoveredDate ? (
        // Appointment-specific design
        <>
          {/* Header with date and count */}
          <div className="px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 mb-1 leading-tight">
                  {formatDateHeader(hoveredDate)}
                </h3>
                <p className="text-xs text-gray-500 leading-tight">
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
          <div className="px-3 py-2 bg-orange-50 border-b border-orange-100">
            <Button
              onClick={handleAddAppointmentClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5"
              size="sm"
            >
              <Plus className="h-3 w-3 mr-1.5" />
              + Make An Appointment
            </Button>
          </div>

          {/* Appointments List */}
          <div style={{ height: tooltipHeight - 120 }}>
            <ScrollArea className="h-full custom-scrollbar">
              {emails.length > 0 ? (
                <div className="space-y-3 p-3 pb-12">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded border-b border-gray-100 last:border-b-0"
                      onClick={(e) => handleEmailClick(email.id, e)}
                    >
                      {/* Appointment Title */}
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-amber-700 leading-snug">
                          {email.subject}
                        </h4>
                      </div>

                      {/* Time and Location */}
                      <div className="space-y-1.5 mb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span className="leading-snug">{formatTime(email.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span className="leading-snug">{email.sender.organization}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-amber-50 px-3 py-2 rounded text-xs text-amber-800 leading-snug">
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
        // Enhanced email design with dynamic sizing
        <>
          {/* Header with Close button */}
          <div className="px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {status === 'unread' ? 'Unread Messages' :
                     status === 'pending' ? 'Pending Replies' :
                     'No Response Yet'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
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

          {/* Content List with dynamic height */}
          <div style={{ height: tooltipHeight - 60 }}>
            <ScrollArea className="h-full custom-scrollbar">
              {emails.length > 0 ? (
                <div className="space-y-3 p-3 pb-12">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded border-b border-gray-100 last:border-b-0"
                      onClick={(e) => handleEmailClick(email.id, e)}
                    >
                      {/* Email Subject */}
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-amber-700 leading-snug">
                          {email.subject}
                        </h4>
                      </div>

                      {/* Sender, Organization and Date */}
                      <div className="space-y-1.5 mb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span className="leading-snug">{email.sender.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Building2 className="w-3 h-3" />
                          <span className="leading-snug">{email.sender.organization}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span className="leading-snug">{format(new Date(email.date), 'MMM d')}</span>
                        </div>
                      </div>

                      {/* Email Preview */}
                      <div className="bg-amber-50 px-3 py-2 rounded text-xs text-gray-600 leading-snug">
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
