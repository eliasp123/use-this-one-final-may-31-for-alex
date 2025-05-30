import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailData } from '@/types/email';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, User, Building2, Plus, Clock } from 'lucide-react';

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
  isEmailRowTooltip = false
}) => {
  const navigate = useNavigate();

  const handleEmailClick = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    
    // If this is from an email row tooltip (in the expanded category view), 
    // navigate directly to the email detail
    if (isEmailRowTooltip) {
      navigate(`/email/${emailId}`);
    } else {
      // If this is from a category card tooltip (main dashboard),
      // navigate to the top of the conversations page for that category and status
      navigate(`/emails/${category}/${status}`);
    }
  };

  const handleAddAppointment = () => {
    onClose();
    // In a real implementation, this would open the appointment form
    console.log('Add appointment clicked from email preview');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getStatusBadge = (email: EmailData) => {
    if (!email.read) {
      return <Badge className="bg-purple-500 hover:bg-purple-600 text-xs">Unread</Badge>;
    } else if (!email.replied) {
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">Pending</Badge>;
    } else if (!email.responseReceived) {
      return <Badge className="bg-red-500 hover:bg-red-600 text-xs">No Response</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Complete</Badge>;
    }
  };

  // Position the tooltip with smart positioning
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.max(10, Math.min(position.x, window.innerWidth - 320)),
    top: Math.max(10, Math.min(position.y, window.innerHeight - 400)),
    zIndex: 9999,
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-2xl border border-gray-200 min-w-[300px] max-w-[320px] max-h-[400px] overflow-hidden"
      style={tooltipStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-semibold text-gray-900">
                {status === 'unread' && 'Unread Messages'}
                {status === 'pending' && 'Pending Replies'}
                {status === 'unresponded' && 'No Response Yet'}
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

      {/* Add Appointment Button */}
      <div className="p-3 border-b border-gray-200 bg-amber-50/30">
        <Button
          onClick={handleAddAppointment}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
      </div>

      {/* Email List */}
      <div className="bg-amber-50/50 border-t border-amber-100">
        {emails.length > 0 ? (
          <div className="p-3 space-y-3">
            {emails.slice(0, 3).map((email) => (
              <div
                key={email.id}
                className="cursor-pointer hover:bg-amber-100/50 rounded-lg p-2 transition-colors"
                onClick={(e) => handleEmailClick(email.id, e)}
              >
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {email.subject}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{email.sender.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{email.sender.organization}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {email.content.length > 45 ? 
                          `${email.content.substring(0, 45)}...` : 
                          email.content
                        }
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(email.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {emails.length > 3 && (
              <div className="text-center pt-2 border-t border-amber-200">
                <span className="text-xs text-gray-500">
                  +{emails.length - 3} more emails
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 text-center">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
            <p className="text-sm text-gray-500">No emails found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPreviewTooltip;
