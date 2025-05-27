
import React from 'react';
import AppointmentPreview from './AppointmentPreview';
import DocumentPreview from './DocumentPreview';
import { useAppointmentFiltering } from '../../hooks/useAppointmentFiltering';
import { useDocumentFiltering } from '../../hooks/useDocumentFiltering';

interface SearchResultsPreviewProps {
  searchQuery: string;
}

const SearchResultsPreview: React.FC<SearchResultsPreviewProps> = ({ searchQuery }) => {
  const { filteredAppointments } = useAppointmentFiltering({ searchQuery });
  const { filteredDocuments } = useDocumentFiltering({ searchQuery });

  // Don't show anything if there's no search query or no results
  if (!searchQuery.trim() || (filteredAppointments.length === 0 && filteredDocuments.length === 0)) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <AppointmentPreview appointments={filteredAppointments} />
      <DocumentPreview documents={filteredDocuments} />
    </div>
  );
};

export default SearchResultsPreview;
