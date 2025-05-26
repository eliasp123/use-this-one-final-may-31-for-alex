
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Reply, CheckCircle, Clock, Lock, Unlock, FileText, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { EmailData } from '../../types/email';
import { categoryInfo } from '../../utils/categoryUtils';
import { SidebarProvider } from '../ui/sidebar';
import DocumentSidebar from '../documents/DocumentSidebar';
import DocumentsHeader from '../documents/DocumentsHeader';
import DocumentsSearchBar from '../documents/DocumentsSearchBar';
import DocumentsFilterRow from '../documents/DocumentsFilterRow';
import DocumentsContent from '../documents/DocumentsContent';
import { getAllAttachments, filterAttachments, getAttachmentStats, AttachmentWithContext } from '../../utils/attachmentUtils';
import { getDocumentsInFolder, createFolder } from '../../utils/folderUtils';
import NewEmailForm from '../NewEmailForm';
import { useToast } from '../../hooks/use-toast';

interface EmailDetailActionsProps {
  email: EmailData;
  onReplyClick: () => void;
  onMarkAsReplied: () => void;
  onMarkAsResponseReceived: () => void;
  onMarkAsPrivate: () => void;
  showReplyForm: boolean;
}

type FilterType = 'all' | 'person' | 'organization' | 'date';

const EmailDetailActions: React.FC<EmailDetailActionsProps> = ({
  email,
  onReplyClick,
  onMarkAsReplied,
  onMarkAsResponseReceived,
  onMarkAsPrivate,
  showReplyForm
}) => {
  const navigate = useNavigate();
  const currentCategory = categoryInfo[email.category];
  const [showDocumentHub, setShowDocumentHub] = useState(false);
  const { toast } = useToast();
  
  // Document Hub state - using same structure as Documents page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'received' | 'sent'>('all');

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

  // Apply direction filter
  const directionFilteredAttachments = directionFilter === 'all'
    ? folderFilteredAttachments 
    : folderFilteredAttachments.filter(attachment => attachment.direction === directionFilter);

  const filteredAttachments = filterAttachments(directionFilteredAttachments, searchQuery, 'all');
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

  // Group attachments by different criteria - same as Documents page
  const groupAttachments = (attachments: AttachmentWithContext[], filterType: FilterType): [string, AttachmentWithContext[]][] => {
    if (filterType === 'all') {
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
    const baseAttachments = directionFilter === 'all' ? allAttachments : 
      allAttachments.filter(attachment => attachment.direction === directionFilter);
    
    if (filterType === 'organization') {
      const uniqueOrgs = new Set(baseAttachments.map(a => a.senderOrganization));
      return uniqueOrgs.size;
    }
    if (filterType === 'person') {
      const uniquePersons = new Set(baseAttachments.map(a => a.senderName));
      return uniquePersons.size;
    }
    if (filterType === 'date') {
      const uniqueMonths = new Set(baseAttachments.map(a => {
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
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-start">
        <Button 
          className="bg-green-500 hover:bg-green-600"
          onClick={onReplyClick}
          disabled={showReplyForm}
        >
          <Reply className="mr-1 h-4 w-4" /> Reply
        </Button>
        
        {!email.replied && (
          <Button variant="outline" onClick={onMarkAsReplied}>
            <CheckCircle className="mr-1 h-4 w-4" /> Mark as Replied
          </Button>
        )}
        
        {email.replied && !email.responseReceived && (
          <Button variant="outline" onClick={onMarkAsResponseReceived}>
            <Clock className="mr-1 h-4 w-4" /> Mark Response Received
          </Button>
        )}
        
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={onMarkAsPrivate}
        >
          {email.private ? (
            <>
              <Unlock className="mr-1 h-4 w-4" /> Remove Private
            </>
          ) : (
            <>
              <Lock className="mr-1 h-4 w-4" /> Mark Private
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={() => navigate(`/emails/${email.category}/all`)}>
          View All {currentCategory.title} Emails
        </Button>
      </div>

      {/* Document Hub Accordion */}
      <Collapsible open={showDocumentHub} onOpenChange={setShowDocumentHub}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-300 w-full justify-between"
          >
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Document Hub
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDocumentHub ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
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

                    <DocumentsFilterRow
                      selectedFilter={selectedFilter}
                      onFilterChange={handleFilterChange}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      directionFilter={directionFilter}
                      onDirectionFilterChange={setDirectionFilter}
                      getFilterCount={getFilterCount}
                    />

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

              {/* New Email Form */}
              <NewEmailForm
                isOpen={showNewEmailForm}
                onClose={() => setShowNewEmailForm(false)}
                onSend={handleNewEmail}
              />
            </SidebarProvider>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EmailDetailActions;
