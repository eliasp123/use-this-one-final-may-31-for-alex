
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
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No emails found matching "{searchQuery}"</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or browse categories below</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-700 text-lg font-medium">
            Found {searchResultsCount} email{searchResultsCount !== 1 ? 's' : ''} matching "{searchQuery}" 
            in {filteredCategoriesCount} categor{filteredCategoriesCount !== 1 ? 'ies' : 'y'}
          </p>
          <p className="text-gray-500 text-sm mt-2">Showing only categories with matching conversations</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay;
