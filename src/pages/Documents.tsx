

import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { FileText, Search, Grid, Users, Calendar, FolderOpen, FileSpreadsheet, Image, Pencil, Mail, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SidebarProvider } from '../components/ui/sidebar';
import CompactDocumentCard from '../components/documents/CompactDocumentCard';
import DocumentSidebar from '../components/documents/DocumentSidebar';
import { getAllAttachments, filterAttachments, getAttachmentStats } from '../utils/attachmentUtils';
import { getDocumentsInFolder, createFolder } from '../utils/folderUtils';
import { AttachmentWithContext } from '../utils/attachmentUtils';
import { useNavigate } from 'react-router-dom';
import NewEmailForm from '../components/NewEmailForm';
import { useToast } from '../hooks/use-toast';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets' | 'organization' | 'date' | 'person'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const allAttachments = getAllAttachments();
  
  // Filter attachments by folder first, then by other criteria
  const folderFilteredAttachments = selectedFolderId 
    ? allAttachments.filter(attachment => {
        const folderAssignments = getDocumentsInFolder(selectedFolderId);
        const isInFolder = folderAssignments.some(assignment => 
          assignment.documentId === attachment.name && assignment.emailId === attachment.emailId
        );
        return isInFolder;
      })
    : allAttachments;

  const filteredAttachments = filterAttachments(folderFilteredAttachments, searchQuery, selectedFilter === 'organization' || selectedFilter === 'date' || selectedFilter === 'person' ? 'all' : selectedFilter);
  const stats = getAttachmentStats(allAttachments);

  const handleCreateFolder = (name: string) => {
    if (name.trim()) {
      createFolder(name.trim());
    }
  };

  const handleNewEmail = (emailData: any) => {
    console.log('New email to be sent:', emailData);
    
    toast({
      title: "Email Sent",
      description: `Email sent to ${emailData.toName} at ${emailData.toOrganization}`,
    });
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

    if (filterType === 'person') {
      const groups: Record<string, AttachmentWithContext[]> = {};
      attachments.forEach(attachment => {
        const key = attachment.senderName || 'Unknown Person';
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

  // Calculate counts for each filter
  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return stats.total;
    if (filterType === 'documents') return stats.documents;
    if (filterType === 'images') return stats.images;
    if (filterType === 'spreadsheets') return stats.spreadsheets;
    if (filterType === 'organization') {
      const uniqueOrgs = new Set(allAttachments.map(a => a.senderOrganization));
      return uniqueOrgs.size;
    }
    if (filterType === 'person') {
      const uniquePersons = new Set(allAttachments.map(a => a.senderName));
      return uniquePersons.size;
    }
    if (filterType === 'date') {
      const uniqueMonths = new Set(allAttachments.map(a => {
        const date = new Date(a.emailDate);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
      }));
      return uniqueMonths.size;
    }
    return 0;
  };

  const filterOptions = [
    { key: 'all', label: 'All Files', icon: FolderOpen },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'images', label: 'Images', icon: Image },
    { key: 'spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet },
    { key: 'person', label: 'Person', icon: User },
    { key: 'organization', label: 'Organization', icon: Users },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SidebarProvider defaultOpen={true}>
        <div className="flex gap-6 w-full">
          <DocumentSidebar 
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
          />
          
          {/* Main content area - centered and wider */}
          <div className="flex-1 min-w-0 flex justify-center">
            <div className="w-full max-w-[1920px] mx-auto px-6 py-4 sm:py-8 pt-16">
              {/* Header section */}
              <div className="text-center mb-8 sm:mb-16">
                <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mb-2 sm:mb-4">Document Hub</h1>
                <p className="text-sm sm:text-base text-gray-600 font-light">Manage and organize your email attachments</p>
                
                <div className="mt-6 sm:mt-8 flex gap-3 justify-center">
                  <Button
                    onClick={() => setShowNewEmailForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Compose New Email
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="px-6 py-3 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Return to Communication Hub
                  </Button>
                </div>
              </div>

              {/* Search bar */}
              <div className="max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 text-base bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter buttons with counts - distributed across full width to match file grid */}
              <div className="mb-6 sm:mb-8">
                <div className="w-full max-w-7xl mx-auto">
                  <div className="grid grid-cols-7 gap-3">
                    {filterOptions.map((filter) => {
                      const IconComponent = filter.icon;
                      const count = getFilterCount(filter.key);
                      return (
                        <Button
                          key={filter.key}
                          variant={selectedFilter === filter.key ? "default" : "outline"}
                          onClick={() => setSelectedFilter(filter.key as any)}
                          className={`
                            px-3 py-3 rounded-lg font-medium transition-all duration-200 flex flex-col items-center h-16 w-full
                            ${selectedFilter === filter.key 
                              ? "bg-purple-500 hover:bg-purple-600 text-white shadow-md" 
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex items-center gap-1">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-xs">{filter.label}</span>
                          </div>
                          <span className="text-xs font-bold mt-1">{count}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Documents Grid */}
              <div className="w-full max-w-7xl mx-auto">
                {filteredAttachments.length > 0 ? (
                  <div className="space-y-6 sm:space-y-8">
                    {groupedAttachments.map(([groupKey, attachments]) => (
                      <div key={groupKey} className="space-y-4 sm:space-y-6">
                        {selectedFilter === 'organization' || selectedFilter === 'date' || selectedFilter === 'person' ? (
                          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <h3 className="text-base sm:text-lg font-medium text-gray-800">{groupKey}</h3>
                          </div>
                        ) : null}
                        <div className="grid grid-cols-3 gap-4">
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
                  <div className="text-center py-24">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3">No documents found</h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                      {searchQuery ? 'Try adjusting your search terms or filters to find the documents you\'re looking for.' : selectedFolderId ? `No documents found in this folder.` : 'No email attachments are available at the moment. Documents will appear here when emails with attachments are received.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* New Email Form */}
        <NewEmailForm
          isOpen={showNewEmailForm}
          onClose={() => setShowNewEmailForm(false)}
          onSend={handleNewEmail}
        />
      </SidebarProvider>
    </div>
  );
};

export default Documents;

