
import React from 'react';
import { EmailData } from '@/types/email';
import { formatDistanceToNow } from 'date-fns';
import { Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmailPreviewTooltipProps {
  emails: EmailData[];
  status: 'unread' | 'pending' | 'unresponded';
  category: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const EmailPreviewTooltip: React.FC<EmailPreviewTooltipProps> = ({
  emails,
  status,
  category,
  position,
  onClose
}) => {
  const navigate = useNavigate();

  const getStatusLabel = () => {
    switch (status) {
      case 'unread':
        return 'Unread Messages';
      case 'pending':
        return 'Pending Replies';
      case 'unresponded':
        return 'Has Not Responded Yet';
    }
  };

  const getStatusRoute = () => {
    switch (status) {
      case 'unread':
        return 'unread';
      case 'pending':
        return 'pending';
      case 'unresponded':
        return 'no-response';
    }
  };

  const handleEmailClick = (emailId: string) => {
    navigate(`/emails/${category}/all`);
    onClose();
  };

  const handleViewAll = () => {
    navigate(`/emails/${category}/${getStatusRoute()}`);
    onClose();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (emails.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-[320px] pointer-events-auto z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(10px, -50%)'
      }}
      onMouseEnter={() => {}} // Prevent tooltip from closing when hovering over it
      onMouseLeave={onClose}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h4 className="text-sm font-semibold text-gray-800">{getStatusLabel()}</h4>
          <span className="text-xs text-gray-500">{emails.length} item{emails.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-2">
          {emails.map(email => (
            <div 
              key={email.id}
              className="p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => handleEmailClick(email.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="font-medium text-gray-700 text-sm">
                  {truncateText(email.sender.name, 20)}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                {truncateText(email.sender.organization, 30)}
              </div>
              <div className="text-xs text-gray-800 mb-1">
                {truncateText(email.subject, 45)}
              </div>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleViewAll}
          className="w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors mt-3 pt-2 border-t border-gray-100"
        >
          View All {getStatusLabel()}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default EmailPreviewTooltip;
