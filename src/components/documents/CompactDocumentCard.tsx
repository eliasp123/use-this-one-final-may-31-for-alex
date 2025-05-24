
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File, 
  Download, 
  Calendar,
  User,
  Building,
  Eye
} from 'lucide-react';

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

  // Get file type icon and colors
  const getFileTypeInfo = (type: string) => {
    if (type.startsWith('image/')) {
      return {
        icon: Image,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        badgeColor: 'bg-purple-100 text-purple-700'
      };
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return {
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        badgeColor: 'bg-blue-100 text-blue-700'
      };
    }
    if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
      return {
        icon: FileSpreadsheet,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        badgeColor: 'bg-green-100 text-green-700'
      };
    }
    return {
      icon: File,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badgeColor: 'bg-orange-100 text-orange-700'
    };
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  const fileInfo = getFileTypeInfo(attachment.type);
  const FileIcon = fileInfo.icon;

  if (layout === 'list') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 border-2 border-gray-300 rounded-xl bg-white relative overflow-hidden" 
            style={{ 
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(0,0,0,0.02) 1px,
                  rgba(0,0,0,0.02) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(0,0,0,0.01) 1px,
                  rgba(0,0,0,0.01) 2px
                )
              `,
              backgroundSize: '20px 20px'
            }}>
        {/* File corner fold */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 transform rotate-45 translate-x-2 -translate-y-2"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-l border-b border-gray-300 bg-gray-100"></div>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* File Icon */}
            <div className={`w-10 h-10 rounded-lg ${fileInfo.bgColor} flex items-center justify-center flex-shrink-0 border border-gray-200`}>
              <FileIcon className={`h-5 w-5 ${fileInfo.color}`} />
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate mb-1">{attachment.name}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {attachment.senderName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(attachment.emailDate)}
                </span>
                <span>{formatFileSize(attachment.size)}</span>
              </div>
            </div>

            {/* Direction Badge */}
            <Badge className={`${fileInfo.badgeColor} text-xs border-0 flex-shrink-0`}>
              {attachment.direction === 'received' ? 'In' : 'Out'}
            </Badge>

            {/* Actions - Hidden by default, shown on hover */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/email/${attachment.emailId}`)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid layout (compact)
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 border-gray-300 rounded-xl bg-white h-full relative overflow-hidden"
          style={{ 
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(0,0,0,0.02) 1px,
                rgba(0,0,0,0.02) 2px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 1px,
                rgba(0,0,0,0.01) 1px,
                rgba(0,0,0,0.01) 2px
              )
            `,
            backgroundSize: '20px 20px'
          }}>
      {/* File corner fold */}
      <div className="absolute top-0 right-0 w-5 h-5 bg-gray-200 transform rotate-45 translate-x-2.5 -translate-y-2.5"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-l border-b border-gray-300 bg-gray-100"></div>
      
      <CardContent className="p-4 flex flex-col h-full">
        {/* File Icon and Name */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-8 h-8 rounded-lg ${fileInfo.bgColor} flex items-center justify-center flex-shrink-0 border border-gray-200`}>
            <FileIcon className={`h-4 w-4 ${fileInfo.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
              {attachment.name}
            </h3>
            <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex-1 space-y-1 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1 truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{attachment.senderName}</span>
          </div>
          <div className="flex items-center gap-1 truncate">
            <Building className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{attachment.senderOrganization}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{formatDate(attachment.emailDate)}</span>
          </div>
        </div>

        {/* Direction Badge */}
        <div className="flex justify-between items-center mb-3">
          <Badge className={`${fileInfo.badgeColor} text-xs border-0`}>
            {attachment.direction === 'received' ? 'Received' : 'Sent'}
          </Badge>
        </div>

        {/* Actions - Compact buttons */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/email/${attachment.emailId}`)}
            className="flex-1 h-7 text-xs px-2 border-gray-200 hover:border-gray-300"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs px-2 border-gray-200 hover:border-gray-300"
          >
            <Download className="h-3 w-3 mr-1" />
            Get
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactDocumentCard;
