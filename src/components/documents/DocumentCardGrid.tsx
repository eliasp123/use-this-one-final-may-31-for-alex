
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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm border border-gray-200/60 h-full cursor-pointer group hover:scale-[1.02]">
          <CardContent className="p-4 flex flex-col h-full">
            {/* Minimal content: File Icon + Name in single row + Status Badge */}
            <div className="flex items-start gap-3 mb-4">
              <FileIcon type={attachment.type} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2 mb-2">
                  {attachment.name}
                </h3>
                <div className="flex justify-end">
                  <StatusBadge 
                    direction={attachment.direction} 
                    statusBadgeColor={attachment.direction === 'sent' ? 'bg-orange-400 text-white' : 'bg-green-400 text-white'} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">{attachment.name}</h4>
            <p className="text-xs text-gray-500">From: {attachment.emailSubject}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">From:</span>
              <span className="font-medium">{attachment.senderName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Organization:</span>
              <span className="font-medium">{attachment.senderOrganization}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Date Received:</span>
              <span className="font-medium">{formatDate(attachment.emailDate)}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
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
      </HoverCardContent>
    </HoverCard>
  );
};

export default DocumentCardGrid;
