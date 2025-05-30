
import React from 'react';
import DocumentCardGrid from './DocumentCardGrid';
import DocumentCardList from './DocumentCardList';
import EmailPreviewCard from './EmailPreviewCard';
import { useIsTablet } from '@/hooks/use-tablet';
import { useEmailPreviewHover } from '@/hooks/useEmailPreviewHover';

interface AttachmentWithContext {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  emailId: string;
  emailSubject: string;
  senderName: string;
  senderOrganization: string;
  emailDate: string;
  direction: 'received' | 'sent';
}

interface DocumentCardProps {
  attachment: AttachmentWithContext;
  isGridView?: boolean;
}

const DocumentCard = ({ attachment, isGridView = false }: DocumentCardProps) => {
  const isTablet = useIsTablet();
  const { hoverState, handleMouseEnter, handleMouseLeave } = useEmailPreviewHover();

  const cardProps = {
    onMouseEnter: !isTablet ? handleMouseEnter : undefined,
    onMouseLeave: !isTablet ? handleMouseLeave : undefined,
  };

  return (
    <div className="relative">
      {isGridView ? (
        <div {...cardProps}>
          <DocumentCardGrid attachment={attachment} />
        </div>
      ) : (
        <div {...cardProps}>
          <DocumentCardList attachment={attachment} />
        </div>
      )}

      {/* Email Preview Card */}
      {hoverState.isVisible && (
        <EmailPreviewCard
          emailId={attachment.emailId}
          emailSubject={attachment.emailSubject}
          senderName={attachment.senderName}
          senderOrganization={attachment.senderOrganization}
          emailDate={attachment.emailDate}
          direction={attachment.direction}
          isVisible={hoverState.isVisible}
          slideDirection={hoverState.slideDirection}
          position={hoverState.position}
        />
      )}
    </div>
  );
};

export default DocumentCard;
