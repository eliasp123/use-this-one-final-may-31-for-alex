
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
  categoryColor: string;
}

const EmailPreviewTooltip: React.FC<EmailPreviewTooltipProps> = ({
  emails,
  status,
  category,
  position,
  onClose,
  categoryColor
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

  const extractContentPreview = (content: string) => {
    // Remove HTML tags and get first sentence or two
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return '';
    
    // Get first sentence, or first two if they're short
    let preview = sentences[0].trim();
    if (sentences.length > 1 && preview.length < 50 && sentences[1]) {
      preview += '. ' + sentences[1].trim();
    }
    
    return truncateText(preview, 120);
  };

  // Extract the base color from the gradient for background styling
  const getBackgroundStyle = () => {
    // Extract color names from gradient classes like "from-rose-400 to-rose-500"
    const gradientMatch = categoryColor.match(/(from|to)-(\w+)-\d+/g);
    if (gradientMatch && gradientMatch[0]) {
      const colorName = gradientMatch[0].replace(/(from|to)-/, '').replace(/-\d+/, '');
      return `bg-${colorName}-50 border-${colorName}-200`;
    }
    return 'bg-gray-50 border-gray-200';
  };

  if (emails.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed border rounded-lg shadow-xl p-4 max-w-[480px] pointer-events-auto z-50 ${getBackgroundStyle()}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, calc(-100% - 10px))'
      }}
      onMouseEnter={() => {}} // Prevent tooltip from closing when hovering over it
      onMouseLeave={onClose}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h4 className="text-sm font-semibold text-gray-800">{getStatusLabel()}</h4>
          <span className="text-xs text-gray-500">{emails.length} item{emails.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-3">
          {emails.map(email => (
            <div 
              key={email.id}
              className="p-3 bg-white/70 rounded-lg border border-gray-100 hover:bg-white cursor-pointer transition-colors"
              onClick={() => handleEmailClick(email.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-gray-700 text-sm">
                  {truncateText(email.sender.name, 25)}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                {truncateText(email.sender.organization, 40)}
              </div>
              
              <div className="text-sm font-medium text-gray-800 mb-2">
                {truncateText(email.subject, 60)}
              </div>
              
              {extractContentPreview(email.content) && (
                <div className="text-xs text-gray-600 leading-relaxed">
                  {extractContentPreview(email.content)}
                </div>
              )}
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
