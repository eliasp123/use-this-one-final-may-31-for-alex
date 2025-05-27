
import React from 'react';

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
  if (!hasSearchQuery) {
    return null;
  }

  return (
    <div className="text-center">
      {hasNoEmailResults ? (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-base">No emails found matching "{searchQuery}"</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms or browse categories below</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <p className="text-gray-700 text-sm font-medium">
            Found {searchResultsCount} email{searchResultsCount !== 1 ? 's' : ''} matching "{searchQuery}" 
            in {filteredCategoriesCount} categor{filteredCategoriesCount !== 1 ? 'ies' : 'y'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay;
