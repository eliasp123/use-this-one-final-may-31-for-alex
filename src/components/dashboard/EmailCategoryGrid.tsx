
import React from 'react';
import { useEmailCategoryGridLogic } from './useEmailCategoryGridLogic';
import EmailCategoryGridHeader from './EmailCategoryGridHeader';
import EmailCategoryGridContent from './EmailCategoryGridContent';
import EmailCategoryGridPagination from './EmailCategoryGridPagination';
import SearchResultsDisplay from './SearchResultsDisplay';
import { EmailCategory } from '../../hooks/useEmailCategoryData';

interface EmailCategoryGridProps {
  categories: EmailCategory[];
  searchQuery?: string;
  itemsPerPage?: number;
  currentPage?: number;
  showPagination?: boolean;
  onCategoryAdded?: () => void;
}

const EmailCategoryGrid: React.FC<EmailCategoryGridProps> = ({
  categories,
  searchQuery = '',
  itemsPerPage = 6,
  currentPage = 1,
  showPagination = true,
  onCategoryAdded
}) => {
  const {
    isListView,
    setIsListView,
    isExpanded,
    setIsExpanded,
    showDialog,
    setShowDialog,
    paginatedCategories,
    totalPages,
    hasSearchQuery,
    searchResults,
    filteredCategories,
    hasNoEmailResults
  } = useEmailCategoryGridLogic({
    categories,
    searchQuery,
    itemsPerPage,
    currentPage
  });

  return (
    <div className="space-y-6">
      <EmailCategoryGridHeader 
        isListView={isListView}
        setIsListView={setIsListView}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      <SearchResultsDisplay
        hasSearchQuery={hasSearchQuery}
        hasNoEmailResults={hasNoEmailResults}
        searchQuery={searchQuery}
        searchResultsCount={searchResults.length}
        filteredCategoriesCount={filteredCategories.length}
      />

      <EmailCategoryGridContent
        categories={paginatedCategories}
        isListView={isListView}
        isExpanded={isExpanded}
        showAddButton={!hasSearchQuery} // Hide "Add New Category" when searching
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        onCategoryAdded={onCategoryAdded}
      />

      {showPagination && totalPages > 1 && !hasSearchQuery && (
        <EmailCategoryGridPagination 
          totalPages={totalPages} 
          currentPage={currentPage} 
        />
      )}
    </div>
  );
};

export default EmailCategoryGrid;
