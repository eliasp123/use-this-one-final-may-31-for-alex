
import React from 'react';
import { useDocumentFiltering } from '../../hooks/useDocumentFiltering';

interface SearchResultsDisplayProps {
  hasSearchQuery: boolean;
  hasNoEmailResults: boolean;
  searchQuery: string;
  searchResultsCount: number;
  filteredCategoriesCount: number;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
  hasSearchQuery,
  hasNoEmailResults,
  searchQuery,
  searchResultsCount,
  filteredCategoriesCount
}) => {
  const { filteredDocuments } = useDocumentFiltering({ searchQuery });

  if (!hasSearchQuery) {
    return null;
  }

  const documentCount = filteredDocuments.length;
  const hasNoResults = hasNoEmailResults && documentCount === 0;

  return (
    <div className="max-w-lg mx-auto mb-8 sm:mb-12">
      {hasNoResults ? (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-base text-center">No emails or documents found matching "{searchQuery}"</p>
          <p className="text-gray-400 text-xs mt-1 text-center">Try adjusting your search terms or browse categories below</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <p className="text-gray-700 text-sm font-medium text-center">
            Found {searchResultsCount} email{searchResultsCount !== 1 ? 's' : ''} and {documentCount} document{documentCount !== 1 ? 's' : ''} for "{searchQuery}" 
            in {filteredCategoriesCount} categor{filteredCategoriesCount !== 1 ? 'ies' : 'y'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay;
