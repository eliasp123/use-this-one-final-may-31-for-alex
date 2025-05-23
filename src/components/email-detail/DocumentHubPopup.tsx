
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
      <DialogContent className="max-w-5xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center text-2xl font-semibold text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Document Hub
          </DialogTitle>
          <p className="text-gray-600 mt-2">Browse and manage all your email attachments</p>
        </DialogHeader>
        
        <div className="flex flex-col h-full space-y-8">
          {/* Stats Section with improved design */}
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

          {/* Search and Filters with improved spacing */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search documents, senders, or organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base bg-white/80 border-gray-300/60 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                {(['all', 'documents', 'images', 'spreadsheets', 'other'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="default"
                    onClick={() => setSelectedFilter(filter)}
                    className={`
                      px-6 py-3 rounded-xl font-medium transition-all duration-200 capitalize
                      ${selectedFilter === filter 
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25" 
                        : "bg-white/80 hover:bg-white text-gray-700 border-gray-300/60 hover:border-purple-300"
                      }
                    `}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Documents List with improved spacing */}
          <div className="flex-1 overflow-y-auto bg-white/30 backdrop-blur-sm rounded-2xl border border-gray-200/60">
            <div className="p-6">
              {filteredAttachments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAttachments.map((attachment) => (
                    <div key={`${attachment.emailId}-${attachment.id}`} className="transform transition-all duration-200 hover:scale-[1.01]">
                      <DocumentCard attachment={attachment} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-gray-200/60">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No documents found</h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    {searchQuery ? 'Try adjusting your search terms or filters' : 'No email attachments are available at the moment'}
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
