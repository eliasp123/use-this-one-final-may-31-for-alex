
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File, 
  Search, 
  Download, 
  Calendar,
  User,
  Building,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { getAllEmails } from '../data/emailData';
import { EmailAttachment, EmailData } from '../types/email';

interface AttachmentWithContext extends EmailAttachment {
  emailId: string;
  emailSubject: string;
  senderName: string;
  senderOrganization: string;
  emailDate: string;
  direction: 'received' | 'sent';
}

const Documents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets' | 'other'>('all');

  // Get all attachments from all emails
  const getAllAttachments = (): AttachmentWithContext[] => {
    const emails = getAllEmails();
    const attachments: AttachmentWithContext[] = [];

    emails.forEach(email => {
      if (email.attachments && email.attachments.length > 0) {
        email.attachments.forEach(attachment => {
          attachments.push({
            ...attachment,
            emailId: email.id,
            emailSubject: email.subject,
            senderName: email.sender.name,
            senderOrganization: email.sender.organization,
            emailDate: email.date,
            direction: 'received' // In a real app, this would track sent vs received
          });
        });
      }
    });

    return attachments.sort((a, b) => new Date(b.emailDate).getTime() - new Date(a.emailDate).getTime());
  };

  const allAttachments = getAllAttachments();

  // Filter attachments based on search and type
  const filteredAttachments = allAttachments.filter(attachment => {
    const matchesSearch = attachment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attachment.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attachment.senderOrganization.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'documents') return attachment.type.includes('pdf') || attachment.type.includes('document') || attachment.type.includes('text');
    if (selectedFilter === 'images') return attachment.type.startsWith('image/');
    if (selectedFilter === 'spreadsheets') return attachment.type.includes('sheet') || attachment.type.includes('csv') || attachment.type.includes('excel');
    if (selectedFilter === 'other') return !attachment.type.startsWith('image/') && !attachment.type.includes('pdf') && !attachment.type.includes('document') && !attachment.type.includes('sheet') && !attachment.type.includes('csv');

    return true;
  });

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

  // Get summary stats
  const getStats = () => {
    const total = allAttachments.length;
    const documents = allAttachments.filter(a => a.type.includes('pdf') || a.type.includes('document')).length;
    const images = allAttachments.filter(a => a.type.startsWith('image/')).length;
    const spreadsheets = allAttachments.filter(a => a.type.includes('sheet') || a.type.includes('csv')).length;
    const other = total - documents - images - spreadsheets;

    return { total, documents, images, spreadsheets, other };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-light text-gray-800">Documents Dashboard</h1>
              <p className="text-gray-600">Manage all your email attachments in one place</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">{stats.documents}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-600">{stats.images}</div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">{stats.spreadsheets}</div>
              <div className="text-sm text-gray-600">Spreadsheets</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">{stats.other}</div>
              <div className="text-sm text-gray-600">Other Files</div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search files, senders, or organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Files' },
              { key: 'documents', label: 'Documents' },
              { key: 'images', label: 'Images' },
              { key: 'spreadsheets', label: 'Spreadsheets' },
              { key: 'other', label: 'Other' }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.key as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Attachments Grid */}
        <div className="grid gap-4">
          {filteredAttachments.length > 0 ? (
            filteredAttachments.map((attachment) => {
              const fileInfo = getFileTypeInfo(attachment.type);
              const FileIcon = fileInfo.icon;

              return (
                <Card key={`${attachment.emailId}-${attachment.id}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${fileInfo.bgColor} flex items-center justify-center`}>
                          <FileIcon className={`h-6 w-6 ${fileInfo.textColor}`} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{attachment.name}</h3>
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
                          <div className="text-sm font-medium text-gray-700">{formatFileSize(attachment.size)}</div>
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
            })
          ) : (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attachments found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : 'No email attachments are available'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
