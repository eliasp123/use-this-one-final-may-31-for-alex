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
  Building
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

interface DocumentCardProps {
  attachment: AttachmentWithContext;
  isGridView?: boolean;
}

const DocumentCard = ({ attachment, isGridView = false }: DocumentCardProps) => {
  const navigate = useNavigate();

  // Get file type icon and colors - using softer variants
  const getFileTypeInfo = (type: string) => {
    if (type.startsWith('image/')) {
      return {
        icon: Image,
        color: 'from-purple-400 to-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        badgeColor: 'bg-purple-400 hover:bg-purple-500',
        statusBadgeColor: 'bg-purple-400 text-white font-normal'
      };
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return {
        icon: FileText,
        color: 'from-blue-400 to-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        badgeColor: 'bg-blue-400 hover:bg-blue-500',
        statusBadgeColor: 'bg-blue-400 text-white font-normal'
      };
    }
    if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
      return {
        icon: FileSpreadsheet,
        color: 'from-green-400 to-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        badgeColor: 'bg-green-400 hover:bg-green-500',
        statusBadgeColor: 'bg-green-400 text-white font-normal'
      };
    }
    return {
      icon: File,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-400 hover:bg-orange-500',
      statusBadgeColor: 'bg-orange-400 text-white font-normal'
    };
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
  const FileIcon = fileInfo.icon;

  if (isGridView) {
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
            <Badge className={`${fileInfo.statusBadgeColor} text-xs`}>
              {attachment.direction === 'received' ? 'Received' : 'Sent'}
            </Badge>
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
  }

  // Original horizontal layout for other views
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${fileInfo.bgColor} flex items-center justify-center`}>
              <FileIcon className={`h-6 w-6 ${fileInfo.textColor}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-700 mb-1">{attachment.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {attachment.senderName}
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {attachment.senderOrganization}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(attachment.emailDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">{formatFileSize(attachment.size)}</div>
              <Badge className={`${fileInfo.statusBadgeColor} text-xs`}>
                {attachment.direction === 'received' ? 'Received' : 'Sent'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/email/${attachment.emailId}`)}
              >
                View Email
              </Button>
              <Button
                size="sm"
                className={`${fileInfo.badgeColor} text-white`}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
