
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Calendar, User, Building } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { getFileTypeInfo, formatDate } from '../../utils/fileTypeUtils';
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
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Top section with file icon, name, and status badge */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileIcon type={attachment.type} size="md" />
            <h3 className="font-medium text-gray-600 text-sm leading-tight line-clamp-2">
              {attachment.name}
            </h3>
          </div>
          <StatusBadge 
            direction={attachment.direction} 
            statusBadgeColor={attachment.direction === 'sent' ? 'bg-orange-400 text-white' : 'bg-green-400 text-white'} 
          />
        </div>

        {/* Metadata section */}
        <div className="p-4 pt-3 space-y-3 flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-600">From:</span>
              <span>{attachment.senderName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building className="h-4 w-4 text-gray-400" />
              <span>{attachment.senderOrganization}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(attachment.emailDate)}</span>
            </div>
          </div>
        </div>

        {/* Single bottom action section */}
        <div className="border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex">
            <Button
              variant="ghost"
              onClick={() => navigate(`/email/${attachment.emailId}`)}
              className="flex-1 h-12 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none rounded-bl-2xl border-r border-gray-200"
            >
              View Email
            </Button>
            <div 
              className={`flex-1 h-12 ${fileInfo.badgeColor} flex items-center justify-center cursor-pointer hover:opacity-90 rounded-none rounded-br-2xl`}
            >
              <Download className="h-4 w-4 mr-2 text-white" />
              <span className="text-sm font-medium text-white">Download</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCardGrid;
