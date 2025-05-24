
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
import FileIconDisplay from './FileIconDisplay';
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
  const navigate = useNavigate();

  // Get file type colors for badge
  const getFileTypeInfo = (type: string) => {
    if (type.startsWith('image/')) {
      return { badgeColor: 'bg-purple-500' };
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return { badgeColor: 'bg-blue-500' };
    }
    if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
      return { badgeColor: 'bg-green-500' };
    }
    return { badgeColor: 'bg-gray-500' };
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

  return (
    <Card className="hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm border border-gray-200/60 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* File Icon and Name */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="mb-3">
            <FileIconDisplay type={attachment.type} size="medium" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
            {attachment.name}
          </h3>
        </div>

        {/* Metadata with icons and darker headings */}
        <div className="flex-1 space-y-3 mb-4">
          <div className="flex items-center justify-center gap-2 text-xs">
            <User className="h-3 w-3 text-gray-600" />
            <span className="font-medium text-gray-700">From:</span>
            <span className="text-gray-600 truncate max-w-[120px]">{attachment.senderName}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs">
            <Building className="h-3 w-3 text-gray-600" />
            <span className="font-medium text-gray-700">Organization:</span>
            <span className="text-gray-600 truncate max-w-[100px]">{attachment.senderOrganization}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-gray-600" />
            <span className="font-medium text-gray-700">Date:</span>
            <span className="text-gray-600">{formatDate(attachment.emailDate)}</span>
          </div>
        </div>

        {/* Size and Direction Badge */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-medium text-gray-600">{formatFileSize(attachment.size)}</div>
          <Badge className={`${fileInfo.badgeColor} text-white text-xs`}>
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
};

export default CompactDocumentCard;
