import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { FileText, Search, Grid, Users, Calendar, FolderOpen, FileSpreadsheet, Image, File } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SidebarProvider } from '../ui/sidebar';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { LayoutGrid, LayoutList } from 'lucide-react';
import CompactDocumentCard from '../documents/CompactDocumentCard';
import DocumentCard from '../documents/DocumentCard';
import DocumentSidebar from '../documents/DocumentSidebar';
import { getAllAttachments, filterAttachments, getAttachmentStats } from '../../utils/attachmentUtils';
import { getDocumentsInFolder, getDocumentFolder, createFolder } from '../../utils/folderUtils';
import { AttachmentWithContext } from '../../utils/attachmentUtils';

interface DocumentHubPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentHubPopup: React.FC<DocumentHubPopupProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets' | 'organization' | 'date'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const allAttachments = getAllAttachments();
  
  // Add debugging for folder filtering
  console.log('Selected folder ID:', selectedFolderId);
  console.log('All attachments:', allAttachments.map(att => ({ id: att.id, emailId: att.emailId, name: att.name })));
  
  if (selectedFolderId) {
    const folderAssignments = getDocumentsInFolder(selectedFolderId);
    console.log(`Folder assignments for ${selectedFolderId}:`, folderAssignments);
  }
  
  // Filter attachments by folder first, then by other criteria
  // Use attachment name as documentId since that's what we have in our assignments
  const folderFilteredAttachments = selectedFolderId 
    ? allAttachments.filter(attachment => {
        const folderAssignments = getDocumentsInFolder(selectedFolderId);
        const isInFolder = folderAssignments.some(assignment => 
          assignment.documentId === attachment.name && assignment.emailId === attachment.emailId
        );
        console.log(`Attachment ${attachment.name} from email ${attachment.emailId} in folder ${selectedFolderId}:`, isInFolder);
        return isInFolder;
      })
    : allAttachments;

  console.log('Folder filtered attachments:', folderFilteredAttachments.length);

  const filteredAttachments = filterAttachments(folderFilteredAttachments, searchQuery, selectedFilter === 'organization' || selectedFilter === 'date' ? 'all' : selectedFilter);
  const stats = getAttachmentStats(allAttachments);

  const handleCreateFolder = (name: string) => {
    if (name.trim()) {
      createFolder(name.trim());
    }
  };

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
      <DialogContent className="max-w-[1424px] w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center text-2xl font-semibold text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Document Hub
          </DialogTitle>
        </DialogHeader>
        
        <SidebarProvider defaultOpen={true}>
          <div className="flex h-full min-h-[600px] w-full">
            <DocumentSidebar 
              selectedFolderId={selectedFolderId}
              onFolderSelect={setSelectedFolderId}
              onCreateFolder={handleCreateFolder}
            />
            
            <div className="flex-1 flex flex-col space-y-6 px-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <Card className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 hover:bg-white/90 transition-all duration-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">{stats.other}</div>
                    <div className="text-sm text-gray-600 font-medium">Other Files</div>
                  </div>
                </Card>
              </div>

              {/* Search and Filters */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
                <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                  {/* Search Bar - Left Side */}
                  <div className="relative w-full lg:min-w-[400px] lg:max-w-[400px] lg:flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search documents, senders, or organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 text-base bg-white/80 border border-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl outline-none transition-all duration-200"
                    />
                  </div>
                  
                  {/* Filter Grid - Right Side */}
                  <div className="grid grid-cols-3 gap-2 ml-auto">
                    {filterOptions.slice(0, 6).map((filter) => {
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

              {/* View Mode Toggle */}
              <div className="flex justify-center">
                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
                  className="border border-gray-200 rounded-lg p-1.5 bg-white shadow-md w-60 justify-center"
                >
                  <ToggleGroupItem 
                    value="grid" 
                    aria-label="Grid view"
                    className="px-4 py-2.5 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 flex-1 justify-center"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Grid</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="list" 
                    aria-label="List view"
                    className="px-4 py-2.5 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 flex-1 justify-center"
                  >
                    <LayoutList className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">List</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Documents Grid */}
              <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-200/60 bg-white">
                <div className="px-6 py-6">
                  {filteredAttachments.length > 0 ? (
                    <div className="space-y-8">
                      {groupedAttachments.map(([groupKey, attachments]) => (
                        <div key={groupKey} className="space-y-6">
                          {selectedFilter === 'organization' || selectedFilter === 'date' ? (
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200/30">
                              <h3 className="text-lg font-semibold text-gray-800">{groupKey}</h3>
                            </div>
                          ) : null}
                          
                          {viewMode === 'grid' ? (
                            <div className="grid grid-cols-3 gap-10">
                              {attachments.map((attachment) => (
                                <div key={`${attachment.emailId}-${attachment.id}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                                  <CompactDocumentCard attachment={attachment} layout="grid" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {attachments.map((attachment) => (
                                <div key={`${attachment.emailId}-${attachment.id}`} className="transform transition-all duration-200 hover:translate-x-1">
                                  <DocumentCard attachment={attachment} isGridView={false} />
                                </div>
                              ))}
                            </div>
                          )}
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
                        {searchQuery ? 'Try adjusting your search terms or filters to find the documents you\'re looking for.' : selectedFolderId ? `No documents found in this folder.` : 'No email attachments are available at the moment. Documents will appear here when emails with attachments are received.'}
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentHubPopup;
