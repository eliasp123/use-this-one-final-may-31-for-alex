import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { FileText, X, Search, Grid, Users, Calendar, FolderOpen, FileSpreadsheet, Image } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CompactDocumentCard from '../documents/CompactDocumentCard';
import { getAllAttachments, filterAttachments, getAttachmentStats } from '../../utils/attachmentUtils';
import { AttachmentWithContext } from '../../utils/attachmentUtils';

interface DocumentHubPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentHubPopup: React.FC<DocumentHubPopupProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets' | 'organization' | 'date'>('all');

  const allAttachments = getAllAttachments();
  const filteredAttachments = filterAttachments(allAttachments, searchQuery, selectedFilter === 'organization' || selectedFilter === 'date' ? 'all' : selectedFilter);
  const stats = getAttachmentStats(allAttachments);

  // Group attachments by different criteria
  const groupAttachments = (attachments: AttachmentWithContext[], filterType: string) => {
    if (filterType === 'all' || filterType === 'documents' || filterType === 'images' || filterType === 'spreadsheets') {
      return [['All Files', attachments] as [string, AttachmentWithContext[]]];
    }

    if (filterType === 'organization') {
      const groups: Record<string, AttachmentWithContext[]> = {};
      attachments.forEach(attachment => {
        const key = attachment.senderOrganization || 'Unknown Organization';
        if (!groups[key]) groups[key] = [];
        groups[key].push(attachment);
      });
      return Object.entries(groups);
    }

    if (filterType === 'date') {
      const groups: Record<string, AttachmentWithContext[]> = {};
      attachments.forEach(attachment => {
        const date = new Date(attachment.emailDate);
        const key = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
        if (!groups[key]) groups[key] = [];
        groups[key].push(attachment);
      });
      return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
    }

    return [['All Files', attachments] as [string, AttachmentWithContext[]]];
  };

  const groupedAttachments = groupAttachments(filteredAttachments, selectedFilter);

  const filterOptions = [
    { key: 'all', label: 'All Files', icon: FolderOpen },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'images', label: 'Images', icon: Image },
    { key: 'spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet },
    { key: 'organization', label: 'Organization', icon: Users },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center text-2xl font-semibold text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Document Hub
          </DialogTitle>
          <p className="text-gray-600 mt-2">Browse and manage all your email attachments</p>
        </DialogHeader>
        
        <div className="flex flex-col h-full space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 hover:bg-white/90 transition-all duration-200">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.total}</div>
                <div className="text-sm text-gray-600 font-medium">Total Files</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 hover:bg-white/90 transition-all duration-200">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.documents}</div>
                <div className="text-sm text-gray-600 font-medium">Documents</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 hover:bg-white/90 transition-all duration-200">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.images}</div>
                <div className="text-sm text-gray-600 font-medium">Images</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 hover:bg-white/90 transition-all duration-200">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">{stats.spreadsheets}</div>
                <div className="text-sm text-gray-600 font-medium">Spreadsheets</div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
            <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
              {/* Search Bar - Left Side (Wider) */}
              <div className="relative w-full lg:min-w-[600px] lg:max-w-[600px] lg:flex-shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search documents, senders, or organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 text-base bg-white/80 border border-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl outline-none transition-all duration-200 lg:min-w-[600px] lg:max-w-[600px]"
                  style={{ minWidth: '600px' }}
                />
              </div>
              
              {/* Filter Grid - Right Side (3x2, Right-aligned) */}
              <div className="grid grid-cols-3 gap-2 ml-auto">
                {filterOptions.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Button
                      key={filter.key}
                      variant={selectedFilter === filter.key ? "default" : "outline"}
                      size="default"
                      onClick={() => setSelectedFilter(filter.key as any)}
                      className={`
                        px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${selectedFilter === filter.key 
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25" 
                          : "bg-white/80 hover:bg-white text-gray-700 border-gray-300/60 hover:border-purple-300"
                        }
                      `}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-400 to-purple-500 backdrop-blur-sm rounded-2xl border border-gray-200/60">
            <div className="p-6">
              {filteredAttachments.length > 0 ? (
                <div className="space-y-8">
                  {groupedAttachments.map(([groupKey, attachments]) => (
                    <div key={groupKey} className="space-y-6">
                      {selectedFilter === 'organization' || selectedFilter === 'date' ? (
                        <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                          <h3 className="text-lg font-semibold text-white">{groupKey}</h3>
                          <span className="text-sm text-white/80 bg-white/20 px-3 py-1 rounded-full">
                            {attachments.length} file{attachments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : null}
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {attachments.map((attachment) => (
                          <div key={`${attachment.emailId}-${attachment.id}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                            <CompactDocumentCard attachment={attachment} layout="grid" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-16 text-center bg-white/60 backdrop-blur-sm border-gray-200/60">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No documents found</h3>
                  <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
                    {searchQuery ? 'Try adjusting your search terms or filters to find the documents you\'re looking for.' : 'No email attachments are available at the moment. Documents will appear here when emails with attachments are received.'}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentHubPopup;
