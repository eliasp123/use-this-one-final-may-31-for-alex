

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Eye, FileText, FileSpreadsheet, Image, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileIcon = () => {
    if (attachment.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-white" />;
    }
    if (attachment.type.includes('pdf')) {
      return <FileText className="w-4 h-4 text-white" />;
    }
    if (attachment.type.includes('sheet') || attachment.type.includes('csv') || attachment.type.includes('excel')) {
      return <FileSpreadsheet className="w-4 h-4 text-white" />;
    }
    if (attachment.type.includes('document') || attachment.type.includes('text') || attachment.type.includes('word')) {
      return <FileText className="w-4 h-4 text-white" />;
    }
    return <File className="w-4 h-4 text-white" />;
  };

  const getFileColor = () => {
    if (attachment.type.startsWith('image/')) {
      return 'bg-gradient-to-br from-purple-200 to-purple-300';
    }
    if (attachment.type.includes('pdf')) {
      return 'bg-gradient-to-br from-red-200 to-red-300';
    }
    if (attachment.type.includes('sheet') || attachment.type.includes('csv') || attachment.type.includes('excel')) {
      return 'bg-gradient-to-br from-green-200 to-green-300';
    }
    if (attachment.type.includes('document') || attachment.type.includes('text') || attachment.type.includes('word')) {
      return 'bg-gradient-to-br from-blue-200 to-blue-300';
    }
    return 'bg-gradient-to-br from-gray-200 to-gray-300';
  };

  const getFileTypeLabel = () => {
    if (attachment.type.startsWith('image/')) {
      return 'IMG';
    }
    if (attachment.type.includes('pdf')) {
      return 'PDF';
    }
    if (attachment.type.includes('sheet') || attachment.type.includes('csv') || attachment.type.includes('excel')) {
      return 'XLS';
    }
    if (attachment.type.includes('document') || attachment.type.includes('text') || attachment.type.includes('word')) {
      return 'DOC';
    }
    return 'FILE';
  };

  const handleView = () => {
    navigate(`/email/${attachment.emailId}`);
  };

  const handleDownload = () => {
    console.log(`Downloading file: ${attachment.name}`);
    // Add download logic here
  };

  if (layout === 'grid') {
    return (
      <Card className="w-72 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50/30 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-amber-200/50">
        {/* File Icon Header */}
        <div className={`${getFileColor()} p-4 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon()}
              <span className="text-stone-600 font-medium text-xs">{getFileTypeLabel()}</span>
            </div>
          </div>
          
          {/* Folded corner effect */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-white/10"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* File Name */}
          <div>
            <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2">
              {attachment.name}
            </h3>
          </div>

          {/* Sender Info */}
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 font-bold">From:</p>
              <p className="text-gray-600 text-xs">{attachment.senderName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold">Organization:</p>
              <p className="text-gray-600 text-xs">{attachment.senderOrganization}</p>
            </div>
          </div>

          {/* Bottom Info - Date and Size */}
          <div className="space-y-2 pt-1">
            <div>
              <p className="text-xs text-gray-500 font-bold">Date:</p>
              <p className="text-gray-600 text-xs">{formatDate(attachment.emailDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Size:</p>
              <p className="text-gray-600 text-xs">{formatFileSize(attachment.size)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1.5 pt-2">
            <Button
              onClick={handleView}
              variant="outline"
              size="sm"
              className="flex-1 flex items-center justify-center space-x-1 hover:bg-blue-50 hover:border-blue-300 text-xs py-3 px-1.5 border-stone-300"
            >
              <Eye className="w-2.5 h-2.5" />
              <span>View</span>
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-xs py-3 px-1.5"
            >
              <Download className="w-2.5 h-2.5" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // List layout
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`${getFileColor()} p-3 rounded-lg`}>
              {getFileIcon()}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-700 mb-1 break-words">{attachment.name}</h3>
              <div className="text-sm text-gray-500">
                {attachment.senderName} • {attachment.senderOrganization}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">{formatFileSize(attachment.size)}</div>
              <div className="text-xs text-gray-500">{getFileTypeLabel()}</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleView}
                className="h-6 px-2 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 h-6 px-2 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
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

