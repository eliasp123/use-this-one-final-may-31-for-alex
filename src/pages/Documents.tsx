
import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { FileText } from 'lucide-react';
import DocumentsHeader from '../components/documents/DocumentsHeader';
import DocumentsStats from '../components/documents/DocumentsStats';
import DocumentsFilters from '../components/documents/DocumentsFilters';
import CompactDocumentCard from '../components/documents/CompactDocumentCard';
import { getAllAttachments, filterAttachments, getAttachmentStats } from '../utils/attachmentUtils';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'documents' | 'images' | 'spreadsheets' | 'other'>('all');

  const allAttachments = getAllAttachments();
  const filteredAttachments = filterAttachments(allAttachments, searchQuery, selectedFilter);
  const stats = getAttachmentStats(allAttachments);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 pt-16">
        <DocumentsHeader />
        <DocumentsStats {...stats} />
        <DocumentsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Attachments Grid */}
        <div className="space-y-4">
          {filteredAttachments.length > 0 ? (
            <div className="space-y-2">
              {filteredAttachments.map((attachment) => (
                <CompactDocumentCard 
                  key={`${attachment.emailId}-${attachment.id}`} 
                  attachment={attachment}
                  layout="list"
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No attachments found</h3>
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
