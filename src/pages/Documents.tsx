import React, { useState } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import DocumentSidebar from '../components/documents/DocumentSidebar';
import DocumentsHeader from '../components/documents/DocumentsHeader';
import DocumentsSearchBar from '../components/documents/DocumentsSearchBar';
import DocumentsFilterButtons from '../components/documents/DocumentsFilterButtons';
import DocumentsViewToggle from '../components/documents/DocumentsViewToggle';
import DocumentsContent from '../components/documents/DocumentsContent';
import { getAllAttachments, filterAttachments, getAttachmentStats, AttachmentWithContext } from '../utils/attachmentUtils';
import { getDocumentsInFolder, createFolder } from '../utils/folderUtils';
import NewEmailForm from '../components/NewEmailForm';
import { useToast } from '../hooks/use-toast';

type FilterType = 'all' | 'documents' | 'images' | 'spreadsheets' | 'organization' | 'date' | 'person';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
  const groupAttachments = (attachments: AttachmentWithContext[], filterType: FilterType): [string, AttachmentWithContext[]][] => {
    if (filterType === 'all' || filterType === 'documents' || filterType === 'images' || filterType === 'spreadsheets') {
      return [['All Files', attachments]];
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

    return [['All Files', attachments]];
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

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter as FilterType);
  };

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
              <DocumentsHeader onNewEmailClick={() => setShowNewEmailForm(true)} />
              
              <DocumentsSearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <DocumentsFilterButtons 
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
                getFilterCount={getFilterCount}
              />

              <DocumentsViewToggle 
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <div className="mt-8">
                <DocumentsContent 
                  groupedAttachments={groupedAttachments}
                  selectedFilter={selectedFilter}
                  filteredAttachments={filteredAttachments}
                  searchQuery={searchQuery}
                  selectedFolderId={selectedFolderId}
                  viewMode={viewMode}
                />
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
