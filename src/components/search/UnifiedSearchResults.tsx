
import React from 'react';
import { useAppointmentFiltering } from '../../hooks/useAppointmentFiltering';
import { useDocumentFiltering } from '../../hooks/useDocumentFiltering';
import AppointmentPreview from './AppointmentPreview';
import DocumentPreview from './DocumentPreview';

interface UnifiedSearchResultsProps {
  searchQuery: string;
}

const UnifiedSearchResults: React.FC<UnifiedSearchResultsProps> = ({ searchQuery }) => {
  const { filteredAppointments } = useAppointmentFiltering({ searchQuery });
  const { filteredDocuments } = useDocumentFiltering({ searchQuery });

  // Don't show anything if there's no search query
  if (!searchQuery.trim()) {
    return null;
  }

  // Don't show if no results found
  if (filteredAppointments.length === 0 && filteredDocuments.length === 0) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mb-8 space-y-4 relative z-40">
      {filteredAppointments.length > 0 && (
        <AppointmentPreview appointments={filteredAppointments} />
      )}
      {filteredDocuments.length > 0 && (
        <DocumentPreview documents={filteredDocuments} />
      )}
    </div>
  );
};

export default UnifiedSearchResults;
