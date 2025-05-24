
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import FileIconDisplay, { getFileTypeInfo } from './FileIconDisplay';
import DocumentMetadata from './DocumentMetadata';
import DocumentActions from './DocumentActions';

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

interface CompactDocumentCardProps {
  attachment: AttachmentWithContext;
  layout?: 'grid' | 'list';
}

const CompactDocumentCard = ({ attachment, layout = 'grid' }: CompactDocumentCardProps) => {
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileInfo = getFileTypeInfo(attachment.type);

  if (layout === 'grid') {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 bg-white border-2 border-gray-200 rounded-xl w-[280px] h-[320px]" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 20px 20px, #f8f9fa 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
        <CardContent className="p-6 flex flex-col h-full">
          {/* File Icon and Name Section */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="mb-3">
              <FileIconDisplay type={attachment.type} size="medium" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 break-words line-clamp-2 px-1 min-h-[2.5rem] flex items-center">
              {attachment.name}
            </h3>
            <div className="text-xs font-medium text-gray-500 mb-3">
              {formatFileSize(attachment.size)}
            </div>
          </div>

          {/* Metadata Section */}
          <DocumentMetadata
            senderName={attachment.senderName}
            senderOrganization={attachment.senderOrganization}
            emailDate={attachment.emailDate}
            layout="grid"
          />

          {/* Direction Badge */}
          <div className="flex justify-center mb-4">
            <Badge className={`${fileInfo.badgeColor} text-white text-xs px-3 py-1 rounded-full`}>
              {attachment.direction === 'received' ? 'Received' : 'Sent'}
            </Badge>
          </div>

          {/* Actions */}
          <DocumentActions
            emailId={attachment.emailId}
            badgeColor={fileInfo.badgeColor}
            layout="grid"
          />
        </CardContent>
      </Card>
    );
  }

  // List layout
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileIconDisplay type={attachment.type} size="small" />
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-700 mb-1 break-words">{attachment.name}</h3>
              <DocumentMetadata
                senderName={attachment.senderName}
                senderOrganization={attachment.senderOrganization}
                emailDate={attachment.emailDate}
                layout="list"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">{formatFileSize(attachment.size)}</div>
              <Badge className={`${fileInfo.badgeColor} text-white text-xs`}>
                {attachment.direction === 'received' ? 'Received' : 'Sent'}
              </Badge>
            </div>
            
            <DocumentActions
              emailId={attachment.emailId}
              badgeColor={fileInfo.badgeColor}
              layout="list"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactDocumentCard;
