
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
        color: 'from-purple-400 to-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        badgeColor: 'bg-purple-500'
      };
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return {
        icon: FileText,
        color: 'from-blue-400 to-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        badgeColor: 'bg-blue-500'
      };
    }
    if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
      return {
        icon: FileSpreadsheet,
        color: 'from-green-400 to-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        badgeColor: 'bg-green-500'
      };
    }
    return {
      icon: File,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-500'
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

  if (layout === 'grid') {
    return (
      <Card className="hover:shadow-sm transition-all duration-200 bg-white border border-gray-300 rounded-lg h-full w-[220px]" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 15px 15px, #f8f9fa 0.8px, transparent 0.8px)',
              backgroundSize: '15px 15px'
            }}>
        <CardContent className="p-3 flex flex-col h-full">
          {/* File Icon and Name Section */}
          <div className="flex flex-col items-center text-center mb-2">
            <div className={`w-8 h-8 rounded-md ${fileInfo.bgColor} flex items-center justify-center mb-1.5 shadow-sm`}>
              <FileIcon className={`h-4 w-4 ${fileInfo.textColor}`} />
            </div>
            <h3 className="font-medium text-gray-800 text-[11px] leading-tight mb-1 break-words line-clamp-2 px-0.5 h-[32px] flex items-center">
              {attachment.name}
            </h3>
            <div className="text-[9px] font-medium text-gray-500 mb-1.5">
              {formatFileSize(attachment.size)}
            </div>
          </div>

          {/* Metadata Section - Ultra Compact */}
          <div className="flex-1 space-y-0.5 mb-2 text-center">
            <div className="flex items-center justify-center gap-0.5 text-[9px] text-gray-600">
              <User className="h-2 w-2 flex-shrink-0" />
              <span className="truncate max-w-[160px]">{attachment.senderName}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 text-[9px] text-gray-500">
              <Building className="h-2 w-2 flex-shrink-0" />
              <span className="truncate max-w-[160px]">{attachment.senderOrganization}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 text-[9px] text-gray-500">
              <Calendar className="h-2 w-2 flex-shrink-0" />
              <span>{formatDate(attachment.emailDate)}</span>
            </div>
          </div>

          {/* Direction Badge - Minimal */}
          <div className="flex justify-center mb-2">
            <Badge className={`${fileInfo.badgeColor} text-white text-[8px] px-1.5 py-0.5 h-3.5 rounded-full`}>
              {attachment.direction === 'received' ? 'Received' : 'Sent'}
            </Badge>
          </div>

          {/* Actions - Tiny Buttons */}
          <div className="flex gap-1 mt-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/email/${attachment.emailId}`)}
              className="flex-1 text-[9px] h-6 px-1.5 border-gray-300 hover:bg-gray-50 font-medium"
            >
              View
            </Button>
            <Button
              size="sm"
              className={`${fileInfo.badgeColor} hover:opacity-90 flex-1 text-[9px] h-6 px-1.5 font-medium`}
            >
              <Download className="h-2 w-2 mr-0.5" />
              Get
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List layout remains unchanged
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${fileInfo.bgColor} flex items-center justify-center`}>
              <FileIcon className={`h-6 w-6 ${fileInfo.textColor}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-700 mb-1 break-words">{attachment.name}</h3>
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
              <Badge className={`${fileInfo.badgeColor} text-white text-xs`}>
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
                className={`${fileInfo.badgeColor} hover:opacity-90`}
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

export default CompactDocumentCard;
