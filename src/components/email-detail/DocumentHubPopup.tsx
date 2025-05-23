
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { FileText, X, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import DocumentCard from '../documents/DocumentCard';
import { getAllAttachments, filterAttachments, getAttachmentStats } from '../../utils/attachmentUtils';

interface DocumentHubPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentHubPopup: React.FC<DocumentHubPopupProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets' | 'other'>('all');

  const allAttachments = getAllAttachments();
  const filteredAttachments = filterAttachments(allAttachments, searchQuery, selectedFilter);
  const stats = getAttachmentStats(allAttachments);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <FileText className="mr-2 h-5 w-5" />
            Document Hub
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Stats Section */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.documents}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.images}</div>
              <div className="text-sm text-gray-600">Images</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.spreadsheets}</div>
              <div className="text-sm text-gray-600">Spreadsheets</div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {(['all', 'documents', 'images', 'spreadsheets', 'other'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={selectedFilter === filter ? "bg-purple-500 hover:bg-purple-600 text-white capitalize" : "capitalize"}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {filteredAttachments.length > 0 ? (
                filteredAttachments.map((attachment) => (
                  <DocumentCard 
                    key={`${attachment.emailId}-${attachment.id}`} 
                    attachment={attachment} 
                  />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No documents found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'Try adjusting your search terms' : 'No email attachments are available'}
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
