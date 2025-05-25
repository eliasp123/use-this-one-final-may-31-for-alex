
import React from 'react';
import { useEmailCategoryData } from '../hooks/useEmailCategoryData';
import { useFilteredEmailData } from '../hooks/useFilteredEmailData';
import EmailCategoryGrid from './dashboard/EmailCategoryGrid';
import SummarySection from './dashboard/SummarySection';

interface RoleAwareEmailDashboardProps {
  searchQuery?: string;
  currentPage?: number;
}

const RoleAwareEmailDashboard: React.FC<RoleAwareEmailDashboardProps> = ({ 
  searchQuery = '',
  currentPage = 1
}) => {
  const { emailCategories, totalUnread, totalPending, totalUnresponded } = useEmailCategoryData();
  const { getFilteredAllEmails } = useFilteredEmailData();
  
  // Apply role-based filtering to categories
  const filteredCategories = emailCategories.map(category => ({
    ...category,
    // Apply role-based filtering to counts
    unread: category.unread, // Already filtered in useEmailCategoryData
    pending: category.pending, // Already filtered in useEmailCategoryData
    total: category.total
  }));

  // Get all emails for search
  const allEmails = getFilteredAllEmails();
  
  // Search logic
  const hasSearchQuery = searchQuery.trim().length > 0;
  const searchResults = hasSearchQuery 
    ? allEmails.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasNoEmailResults = hasSearchQuery && searchResults.length === 0;

  console.log('Search debug:', {
    searchQuery: searchQuery.trim(),
    hasSearchQuery,
    totalEmailsFound: searchResults.length,
    hasNoEmailResults,
    emailCategories: filteredCategories.length
  });

  return (
    <div className="space-y-8 sm:space-y-16">
      {/* Summary Section */}
      <SummarySection 
        totalUnread={totalUnread}
        totalPending={totalPending} 
        totalUnresponded={totalUnresponded}
      />
      
      {/* Search Results or No Results Message */}
      {hasSearchQuery && (
        <div className="text-center">
          {hasNoEmailResults ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">No emails found matching "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or browse categories below</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-gray-700 text-lg font-medium">
                Found {searchResults.length} email{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
              <p className="text-gray-500 text-sm mt-2">Browse categories below to see all conversations</p>
            </div>
          )}
        </div>
      )}
      
      {/* Email Categories Grid with hybrid approach */}
      <EmailCategoryGrid
        categories={filteredCategories}
        searchQuery={searchQuery}
        itemsPerPage={6}
        currentPage={currentPage}
        showPagination={false}
      />
    </div>
  );
};

export default RoleAwareEmailDashboard;
