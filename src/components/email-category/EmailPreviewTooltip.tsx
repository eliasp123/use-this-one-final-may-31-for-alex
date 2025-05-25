
import React, { useEffect, useState } from 'react';
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
  const [smartPosition, setSmartPosition] = useState({ x: position.x, y: position.y, placement: 'top' });

  // Calculate smart positioning based on available screen space
  useEffect(() => {
    const tooltipHeight = 400; // Approximate height of tooltip
    const tooltipWidth = 480; // Max width from the component
    const margin = 20; // Safety margin from screen edges
    const gap = 8; // Gap between trigger and tooltip

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Determine vertical placement
    const spaceAbove = position.y - margin;
    const spaceBelow = viewportHeight - position.y - margin;
    const shouldPlaceBelow = spaceAbove < tooltipHeight && spaceBelow > spaceAbove;

    // Determine horizontal centering with bounds checking
    let xPos = position.x;
    const halfWidth = tooltipWidth / 2;
    
    // Keep tooltip within horizontal bounds
    if (xPos - halfWidth < margin) {
      xPos = halfWidth + margin;
    } else if (xPos + halfWidth > viewportWidth - margin) {
      xPos = viewportWidth - halfWidth - margin;
    }

    setSmartPosition({
      x: xPos,
      y: position.y,
      placement: shouldPlaceBelow ? 'bottom' : 'top'
    });
  }, [position]);

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
    // Remove HTML tags and get content
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    
    // Split into sentences and words to better control line breaks
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return '';
    
    // Build preview text that will fit approximately 3 lines
    let preview = '';
    let totalLength = 0;
    const maxLength = 240; // Increased to accommodate 3 lines
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (totalLength + trimmedSentence.length + 2 <= maxLength) {
        preview += (preview ? '. ' : '') + trimmedSentence;
        totalLength = preview.length;
      } else {
        // If adding this sentence would exceed limit, truncate it
        const remainingSpace = maxLength - totalLength - 2;
        if (remainingSpace > 20) { // Only add partial sentence if there's meaningful space
          preview += (preview ? '. ' : '') + trimmedSentence.substring(0, remainingSpace) + '...';
        }
        break;
      }
    }
    
    return preview || cleanContent.substring(0, maxLength) + (cleanContent.length > maxLength ? '...' : '');
  };

  if (emails.length === 0) {
    return null;
  }

  // Calculate transform based on placement with improved gap handling
  const getTransform = () => {
    if (smartPosition.placement === 'bottom') {
      return 'translate(-50%, 8px)'; // Smaller gap to reduce mouse travel distance
    }
    return 'translate(-50%, calc(-100% - 8px))'; // Smaller gap for consistency
  };

  return (
    <div 
      className="fixed bg-gray-50 border border-gray-200 rounded-lg shadow-xl p-4 max-w-[480px] pointer-events-auto z-[9999]"
      style={{
        left: `${smartPosition.x}px`,
        top: `${smartPosition.y}px`,
        transform: getTransform(),
        position: 'fixed' // Ensure it's truly fixed and won't affect layout
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
                <div className="text-xs text-gray-700 leading-relaxed p-2 bg-amber-50 border border-amber-100 rounded min-h-[3.5rem]">
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
