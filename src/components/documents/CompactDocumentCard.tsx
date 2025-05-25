
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import FileIconDisplay from './FileIconDisplay';
import StatusBadge from './StatusBadge';

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
  const navigate = useNavigate();

  // Get file type colors for badge
  const getFileTypeInfo = (type: string) => {
    if (type.startsWith('image/')) {
      return { 
        badgeColor: 'bg-purple-500',
        statusBadgeColor: 'bg-purple-400 text-white font-normal text-xs'
      };
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return { 
        badgeColor: 'bg-blue-500',
        statusBadgeColor: 'bg-blue-400 text-white font-normal text-xs'
      };
    }
    if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
      return { 
        badgeColor: 'bg-green-500',
        statusBadgeColor: 'bg-green-400 text-white font-normal text-xs'
      };
    }
    return { 
      badgeColor: 'bg-gray-500',
      statusBadgeColor: 'bg-gray-400 text-white font-normal text-xs'
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fileInfo = getFileTypeInfo(attachment.type);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02] h-full bg-white border border-gray-200">
      <CardContent className="p-4 flex flex-col h-full">
        {/* File Icon + Name in single row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            <FileIconDisplay type={attachment.type} size="small" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2">
              {attachment.name}
            </h3>
          </div>
        </div>

        {/* Essential info */}
        <div className="space-y-2 text-xs text-gray-600 mb-4">
          <div><span className="font-medium">From:</span> {attachment.senderName}</div>
          <div><span className="font-medium">Organization:</span> {attachment.senderOrganization}</div>
          <div><span className="font-medium">Date:</span> {formatDate(attachment.emailDate)}</div>
        </div>

        {/* Status badge and actions */}
        <div className="mt-auto space-y-3">
          <div className="flex justify-end">
            <StatusBadge 
              direction={attachment.direction} 
              statusBadgeColor="" 
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/email/${attachment.emailId}`)}
              className="flex-1 text-xs h-8"
            >
              View Email
            </Button>
            <Button
              size="sm"
              className={`${fileInfo.badgeColor} text-white flex-1 text-xs h-8`}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactDocumentCard;
