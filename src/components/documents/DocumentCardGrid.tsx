
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Calendar, User, Building } from 'lucide-react';
import { getFileTypeInfo, getStatusBadgeColor, formatFileSize, formatDate } from '../../utils/fileTypeUtils';
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

interface DocumentCardGridProps {
  attachment: AttachmentWithContext;
}

const DocumentCardGrid = ({ attachment }: DocumentCardGridProps) => {
  const navigate = useNavigate();
  const fileInfo = getFileTypeInfo(attachment.type);
  const FileIcon = fileInfo.icon;
  const statusBadgeColor = getStatusBadgeColor(attachment.direction, fileInfo.statusBadgeColor);

  console.log('Grid view - direction:', attachment.direction, 'statusBadgeColor:', statusBadgeColor);
  console.log('Grid view - fileInfo.statusBadgeColor:', fileInfo.statusBadgeColor);
  console.log('Grid view - about to render StatusBadge with:', { direction: attachment.direction, statusBadgeColor });

  return (
    <Card className="hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm border border-gray-200/60 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* File Icon and Name */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className={`w-16 h-16 rounded-2xl ${fileInfo.bgColor} flex items-center justify-center mb-3 shadow-sm`}>
            <FileIcon className={`h-8 w-8 ${fileInfo.textColor}`} />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
            {attachment.name}
          </h3>
        </div>

        {/* Metadata */}
        <div className="flex-1 space-y-2 mb-4">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span className="truncate">{attachment.senderName}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <Building className="h-3 w-3" />
            <span className="truncate">{attachment.senderOrganization}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(attachment.emailDate)}</span>
          </div>
        </div>

        {/* Size and Direction Badge */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-medium text-gray-600">{formatFileSize(attachment.size)}</div>
          <StatusBadge direction={attachment.direction} statusBadgeColor={statusBadgeColor} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/email/${attachment.emailId}`)}
            className="flex-1 text-xs"
          >
            View Email
          </Button>
          <Button
            size="sm"
            className={`${fileInfo.badgeColor} text-white flex-1 text-xs`}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCardGrid;
