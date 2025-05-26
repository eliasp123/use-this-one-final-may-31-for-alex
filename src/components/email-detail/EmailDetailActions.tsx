
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Reply, CheckCircle, Clock, Lock, Unlock, FileText, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { EmailData } from '../../types/email';
import { categoryInfo } from '../../utils/categoryUtils';
import { useToast } from '../../hooks/use-toast';
import SimpleFolderList from '../documents/SimpleFolderList';
import DocumentsStats from '../documents/DocumentsStats';
import DocumentsFilters from '../documents/DocumentsFilters';
import DocumentsContent from '../documents/DocumentsContent';
import { getAllAttachments, filterAttachments, getAttachmentStats, AttachmentWithContext } from '../../utils/attachmentUtils';
import { getDocumentsInFolder, createFolder } from '../../utils/folderUtils';

interface EmailDetailActionsProps {
  email: EmailData;
  onReplyClick: () => void;
  onMarkAsReplied: () => void;
  onMarkAsResponseReceived: () => void;
  onMarkAsPrivate: () => void;
  showReplyForm: boolean;
}

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
  
  // Document Hub state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [folderRefreshKey, setFolderRefreshKey] = useState(0);

  const allAttachments = getAllAttachments();
  
  // Filter attachments by folder first, then by other criteria
  const folderFilteredAttachments = selectedFolderId 
    ? allAttachments.filter(attachment => {
        const folderAssignments = getDocumentsInFolder(selectedFolderId);
        return folderAssignments.some(assignment => 
          assignment.documentId === attachment.name && assignment.emailId === attachment.emailId
        );
      })
    : allAttachments;

  const filteredAttachments = filterAttachments(folderFilteredAttachments, searchQuery, selectedFilter);
  const stats = getAttachmentStats(allAttachments);

  const handleCreateFolder = (name: string) => {
    if (name.trim()) {
      createFolder(name.trim());
      setFolderRefreshKey(prev => prev + 1);
    }
  };

  // Group attachments by different criteria
  const groupAttachments = (attachments: AttachmentWithContext[], filterType: string): [string, AttachmentWithContext[]][] => {
    if (filterType === 'all' || filterType === 'documents' || filterType === 'images' || filterType === 'spreadsheets') {
      return [['All Files', attachments]];
    }
    return [['All Files', attachments]];
  };

  const groupedAttachments = groupAttachments(filteredAttachments, selectedFilter);
  
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
          <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex w-full min-h-[600px]">
              <div className="min-w-[240px] max-w-[280px] border-r border-gray-200 pr-4">
                <SimpleFolderList
                  key={folderRefreshKey}
                  selectedFolderId={selectedFolderId}
                  onFolderSelect={setSelectedFolderId}
                  onCreateFolder={handleCreateFolder}
                />
              </div>
              
              <div className="flex-1 px-6">
                <div className="space-y-6">
                  <DocumentsStats 
                    total={stats.total}
                    documents={stats.documents}
                    images={stats.images}
                    spreadsheets={stats.spreadsheets}
                    other={stats.other}
                  />
                  
                  <DocumentsFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
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
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EmailDetailActions;
