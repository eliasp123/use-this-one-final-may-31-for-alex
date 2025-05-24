
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Calendar, User, Building } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { getFileTypeInfo, formatFileSize, formatDate } from '../../utils/fileTypeUtils';
import StatusBadge from './StatusBadge';
import FileIcon from './FileIcon';

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

interface DocumentCardGridProps {
  attachment: AttachmentWithContext;
}

const DocumentCardGrid = ({ attachment }: DocumentCardGridProps) => {
  const navigate = useNavigate();
  const fileInfo = getFileTypeInfo(attachment.type);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm border border-gray-200/60 h-full cursor-pointer">
          <CardContent className="p-4 flex flex-col h-full">
            {/* File Icon and Name */}
            <div className="flex flex-col items-center text-center mb-3">
              <FileIcon type={attachment.type} size="lg" />
              <h3 className="font-medium text-gray-800 text-sm leading-tight mt-3 mb-2 line-clamp-2">
                {attachment.name}
              </h3>
            </div>

            {/* Size and Status Badge Row */}
            <div className="flex justify-between items-center mb-3 mt-auto">
              <span className="text-xs font-medium text-gray-600">{formatFileSize(attachment.size)}</span>
              <StatusBadge 
                direction={attachment.direction} 
                statusBadgeColor={attachment.direction === 'sent' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'} 
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/email/${attachment.emailId}`)}
                className="flex-1 text-xs h-8"
              >
                View
              </Button>
              <Button
                size="sm"
                className={`${fileInfo.badgeColor} text-white flex-1 text-xs h-8`}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">{attachment.name}</h4>
            <p className="text-xs text-gray-500 mt-1">From: {attachment.emailSubject}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span>{attachment.senderName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-400" />
              <span>{attachment.senderOrganization}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(attachment.emailDate)}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DocumentCardGrid;
