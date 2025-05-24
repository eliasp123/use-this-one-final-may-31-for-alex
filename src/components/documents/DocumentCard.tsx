
import React from 'react';
import DocumentCardGrid from './DocumentCardGrid';
import DocumentCardList from './DocumentCardList';

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
  if (isGridView) {
    return <DocumentCardGrid attachment={attachment} />;
  }

  return <DocumentCardList attachment={attachment} />;
};

export default DocumentCard;
