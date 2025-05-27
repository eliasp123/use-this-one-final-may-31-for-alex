
import React from 'react';
import { useEmailCategoryData } from '../hooks/useEmailCategoryData';
import { getAllEmailsWithAttachments } from '../utils/emailDataUtils';
import EmailCategoryGrid from './dashboard/EmailCategoryGrid';
import ConsolidatedSummaryBar from './dashboard/ConsolidatedSummaryBar';

interface RoleAwareEmailDashboardProps {
  searchQuery?: string;
  currentPage?: number;
}

const RoleAwareEmailDashboard: React.FC<RoleAwareEmailDashboardProps> = ({ 
  searchQuery = '',
  currentPage = 1
}) => {
  const { emailCategories, totalUnread, totalPending, totalUnresponded } = useEmailCategoryData();
  
  // Get all emails with proper data flow
  const allEmails = getAllEmailsWithAttachments();
  
  // Enhanced search logic with fuzzy matching
  const hasSearchQuery = searchQuery.trim().length > 0;
  const searchResults = hasSearchQuery 
    ? allEmails.filter(email => {
        const query = searchQuery.toLowerCase().trim();
        
        // Split search query into individual terms for fuzzy matching
        const searchTerms = query.split(/\s+/);
        
        // Check if all search terms are found in any of the searchable fields
        const searchableText = [
          email.subject,
          email.sender.name,
          email.sender.email,
          email.sender.organization,
          email.content
        ].join(' ').toLowerCase();
        
        // Fuzzy matching: all terms must be found somewhere in the searchable text
        return searchTerms.every(term => searchableText.includes(term));
      })
    : [];

  const hasNoEmailResults = hasSearchQuery && searchResults.length === 0;

  // Filter categories to only show those that have matching emails when searching
  const filteredCategories = hasSearchQuery 
    ? emailCategories.filter(category => {
        // Get all category IDs that have matching emails
        const categoriesWithMatches = new Set(searchResults.map(email => email.category));
        return categoriesWithMatches.has(category.id);
      })
    : emailCategories; // Show all categories when not searching

  console.log('🔍 ENHANCED Search debug:', {
    searchQuery: searchQuery.trim(),
    searchTerms: hasSearchQuery ? searchQuery.toLowerCase().trim().split(/\s+/) : [],
    hasSearchQuery,
    totalEmailsAvailable: allEmails.length,
    totalEmailsFound: searchResults.length,
    hasNoEmailResults,
    originalCategories: emailCategories.length,
    filteredCategories: filteredCategories.length,
    filteredCategoryIds: filteredCategories.map(c => c.id),
    searchResultCategories: [...new Set(searchResults.map(email => email.category))],
    sampleEmails: allEmails.slice(0, 3).map(e => ({ 
      id: e.id, 
      subject: e.subject, 
      sender: e.sender.name, 
      organization: e.sender.organization,
      category: e.category 
    }))
  });

  return (
    <div className="space-y-8 sm:space-y-16">
      {/* Consolidated Summary Bar */}
      <ConsolidatedSummaryBar 
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
                in {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
              </p>
              <p className="text-gray-500 text-sm mt-2">Showing only categories with matching conversations</p>
            </div>
          )}
        </div>
      )}
      
      {/* Email Categories Grid - now properly filtered */}
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
