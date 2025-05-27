
import React from 'react';
import AppointmentPreview from './AppointmentPreview';
import DocumentPreview from './DocumentPreview';
import SearchResultsDisplay from '../dashboard/SearchResultsDisplay';
import { useAppointmentFiltering } from '../../hooks/useAppointmentFiltering';
import { useDocumentFiltering } from '../../hooks/useDocumentFiltering';
import { useEmailFiltering } from '../../hooks/useEmailFiltering';

interface SearchResultsPreviewProps {
  searchQuery: string;
}

const SearchResultsPreview: React.FC<SearchResultsPreviewProps> = ({ searchQuery }) => {
  const { filteredAppointments } = useAppointmentFiltering({ searchQuery });
  const { filteredDocuments } = useDocumentFiltering({ searchQuery });
  const { filteredEmails } = useEmailFiltering({ 
    category: undefined, 
    activeTab: 'all', 
    searchQuery 
  });

  // Don't show anything if there's no search query
  if (!searchQuery.trim()) {
    return null;
  }

  const hasEmailResults = filteredEmails.length > 0;
  const hasNoEmailResults = !hasEmailResults;
  const searchResultsCount = filteredEmails.length;
  
  // Count categories that have emails
  const emailsByCategory = filteredEmails.reduce((acc, email) => {
    acc[email.category] = (acc[email.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const filteredCategoriesCount = Object.keys(emailsByCategory).length;

  return (
    <div className="max-w-lg mx-auto">
      <SearchResultsDisplay
        hasSearchQuery={true}
        hasNoEmailResults={hasNoEmailResults}
        searchQuery={searchQuery}
        searchResultsCount={searchResultsCount}
        filteredCategoriesCount={filteredCategoriesCount}
      />
      
      <DocumentPreview documents={filteredDocuments} />
      <AppointmentPreview appointments={filteredAppointments} />
    </div>
  );
};

export default SearchResultsPreview;
