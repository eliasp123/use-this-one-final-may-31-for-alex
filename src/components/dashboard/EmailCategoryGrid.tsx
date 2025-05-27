
import React, { useState } from 'react';
import { useEmailCategoryGridLogic } from './useEmailCategoryGridLogic';
import EmailCategoryGridHeader from './EmailCategoryGridHeader';
import EmailCategoryGridContent from './EmailCategoryGridContent';
import EmailCategoryListContent from './EmailCategoryListContent';
import EmailCategoryGridPagination from './EmailCategoryGridPagination';
import SearchResultsDisplay from './SearchResultsDisplay';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import { getAllEmailsWithAttachments } from '../../utils/emailDataUtils';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search logic
  const allEmails = getAllEmailsWithAttachments();
  const hasSearchQuery = searchQuery.trim().length > 0;
  const searchResults = hasSearchQuery 
    ? allEmails.filter(email => {
        const query = searchQuery.toLowerCase().trim();
        const searchTerms = query.split(/\s+/);
        const searchableText = [
          email.subject,
          email.sender.name,
          email.sender.email,
          email.sender.organization,
          email.content
        ].join(' ').toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
      })
    : [];

  const hasNoEmailResults = hasSearchQuery && searchResults.length === 0;
  const filteredCategories = hasSearchQuery 
    ? categories.filter(category => {
        const categoriesWithMatches = new Set(searchResults.map(email => email.category));
        return categoriesWithMatches.has(category.id);
      })
    : categories;

  // Use the existing hook for pagination
  const {
    activePage,
    totalPages,
    priorityCategories,
    compactCategories,
    addButtonInFirstRow,
    addButtonInCompactRows,
    handlePageChange
  } = useEmailCategoryGridLogic({
    categories: filteredCategories,
    currentPage
  });

  return (
    <div className="space-y-6">
      <EmailCategoryGridHeader 
        activePage={activePage}
        totalPages={totalPages}
        showPagination={showPagination && totalPages > 1 && !hasSearchQuery}
        onPageChange={handlePageChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <SearchResultsDisplay
        hasSearchQuery={hasSearchQuery}
        hasNoEmailResults={hasNoEmailResults}
        searchQuery={searchQuery}
        searchResultsCount={searchResults.length}
        filteredCategoriesCount={filteredCategories.length}
      />

      {viewMode === 'grid' ? (
        <EmailCategoryGridContent
          priorityCategories={priorityCategories}
          compactCategories={compactCategories}
          addButtonInFirstRow={addButtonInFirstRow && !hasSearchQuery}
          addButtonInCompactRows={addButtonInCompactRows && !hasSearchQuery}
          onAddNewCategory={onCategoryAdded || (() => {})}
        />
      ) : (
        <EmailCategoryListContent
          categories={filteredCategories}
          onAddNewCategory={onCategoryAdded || (() => {})}
          showAddButton={!hasSearchQuery}
        />
      )}

      {showPagination && totalPages > 1 && !hasSearchQuery && (
        <EmailCategoryGridPagination 
          activePage={activePage}
          totalPages={totalPages}
          showPagination={true}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EmailCategoryGrid;
