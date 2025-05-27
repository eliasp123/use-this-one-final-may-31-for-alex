
import React, { useState, useRef } from 'react';
import { useEmailCategoryGridLogic } from './useEmailCategoryGridLogic';
import EmailCategoryGridHeader from './EmailCategoryGridHeader';
import EmailCategoryGridContent from './EmailCategoryGridContent';
import EmailCategoryListContent, { EmailCategoryListContentRef } from './EmailCategoryListContent';
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
  const listContentRef = useRef<EmailCategoryListContentRef>(null);

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

  const handleCollapseAll = () => {
    listContentRef.current?.collapseAll();
  };

  return (
    <div className="space-y-6">
      <EmailCategoryGridHeader 
        activePage={activePage}
        totalPages={totalPages}
        showPagination={showPagination && totalPages > 1 && !hasSearchQuery}
        onPageChange={handlePageChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCollapseAll={viewMode === 'list' ? handleCollapseAll : undefined}
      />

      <SearchResultsDisplay
        hasSearchQuery={hasSearchQuery}
        hasNoEmailResults={hasNoEmailResults}
        searchQuery={searchQuery}
        searchResultsCount={searchResults.length}
        filteredCategoriesCount={filteredCategories.length}
      />

      <div className="pt-3">
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
            ref={listContentRef}
            categories={filteredCategories}
            onAddNewCategory={onCategoryAdded || (() => {})}
            showAddButton={!hasSearchQuery}
          />
        )}
      </div>

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
