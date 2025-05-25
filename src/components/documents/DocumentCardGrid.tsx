
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
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
        {/* Top section with file icon and name - colored with file type */}
        <div className={`${fileInfo.badgeColor} p-4 pb-3 rounded-t-2xl`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-sm">
              <fileInfo.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-medium text-white text-sm leading-tight line-clamp-2">
              {attachment.name}
            </h3>
          </div>
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

        {/* Single integrated action row with status badge above download */}
        <div className="bg-white/50 backdrop-blur-sm rounded-b-2xl border-t border-gray-200/60 shadow-sm flex items-stretch h-12">
          {/* View Email section */}
          <button
            onClick={() => navigate(`/email/${attachment.emailId}`)}
            className="flex items-center justify-center flex-1 transition-all duration-200 h-full text-gray-700 hover:bg-gray-100 rounded-bl-2xl"
          >
            <span className="text-sm font-medium">View Email</span>
          </button>

          {/* Download section with status badge above */}
          <div className="flex-1 relative">
            {/* Status badge positioned above download button */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <StatusBadge 
                direction={attachment.direction} 
                statusBadgeColor={attachment.direction === 'sent' ? 'bg-orange-400 text-white' : 'bg-green-400 text-white'} 
              />
            </div>
            
            {/* Download button */}
            <div 
              className={`${fileInfo.badgeColor} text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-200 h-full rounded-br-2xl`}
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Download</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCardGrid;
