
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailData } from '@/types/email';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, User, Building2 } from 'lucide-react';

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
    left: Math.max(10, Math.min(position.x, window.innerWidth - 490)),
    top: Math.max(10, Math.min(position.y, window.innerHeight - 400)),
    zIndex: 9999,
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[480px] max-h-[380px] overflow-hidden"
      style={tooltipStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {status === 'unread' && 'Unread Messages'}
            {status === 'pending' && 'Pending Replies'}
            {status === 'unresponded' && 'No Response Yet'}
          </span>
          <span className={`w-5 h-5 text-xs font-medium text-white rounded-full flex items-center justify-center bg-gradient-to-r ${categoryColor}`}>
            {emails.length}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg font-medium"
        >
          ×
        </button>
      </div>

      {/* Email List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {emails.slice(0, 5).map((email) => (
          <div
            key={email.id}
            className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={(e) => handleEmailClick(email.id, e)}
          >
            {/* Email Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate mb-1">
                  {email.subject}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{email.sender.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{email.sender.organization}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                {getStatusBadge(email)}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(email.date)}</span>
                </div>
              </div>
            </div>

            {/* Email Preview */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {email.content.substring(0, 120)}...
            </p>

            {/* Attachments indicator */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-500">
                  📎 {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {emails.length > 5 && (
          <div className="text-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              +{emails.length - 5} more emails
            </span>
          </div>
        )}
        
        {emails.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No emails found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPreviewTooltip;
