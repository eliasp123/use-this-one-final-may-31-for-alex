
import React from 'react';
import EmailCategoryCard from '../EmailCategoryCard';
import CompactCategoryItem from './CompactCategoryItem';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '../ui/pagination';

interface EmailCategory {
  id: string;
  title: string;
  icon: any;
  unread: number;
  pending: number;
  total: number;
  color: string;
  bgColor: string;
  textColor: string;
}

interface EmailCategoryGridProps {
  categories: EmailCategory[];
  searchQuery?: string;
  itemsPerPage: number;
  currentPage?: number;
  showPagination?: boolean;
}

const EmailCategoryGrid: React.FC<EmailCategoryGridProps> = ({ 
  categories, 
  searchQuery = '', 
  itemsPerPage,
  currentPage = 1,
  showPagination = true
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = React.useState(1);
  
  // Use external currentPage if provided, otherwise use internal state
  const activePage = currentPage || internalCurrentPage;
  
  // When there's a search query, only show categories that have emails
  // When there's no search query, show all categories
  const filteredCategories = searchQuery.trim() 
    ? categories.filter(category => category.total > 0)
    : categories;
  
  console.log('EmailCategoryGrid debug:', {
    searchQuery: searchQuery.trim(),
    originalCategories: categories.length,
    filteredCategories: filteredCategories.length,
    categoriesWithEmails: categories.filter(c => c.total > 0).length,
    totalEmailsAcrossCategories: categories.reduce((sum, cat) => sum + cat.total, 0)
  });
  
  // Split categories into priority (urgent) and non-priority
  const priorityCategories = filteredCategories.filter(cat => cat.unread > 0 || cat.pending > 0);
  const nonPriorityCategories = filteredCategories.filter(cat => cat.unread === 0 && cat.pending === 0);
  
  console.log('Priority split:', {
    priorityCount: priorityCategories.length,
    nonPriorityCount: nonPriorityCategories.length,
    priorityCategories: priorityCategories.map(c => ({ id: c.id, unread: c.unread, pending: c.pending })),
    nonPriorityCategories: nonPriorityCategories.map(c => ({ id: c.id, unread: c.unread, pending: c.pending }))
  });
  
  // Handle page change (only used when showPagination is true and no external currentPage)
  const handlePageChange = (page: number) => {
    if (!currentPage) {
      setInternalCurrentPage(page);
    }
  };
  
  return (
    <>
      {/* Priority Categories Section */}
      {priorityCategories.length > 0 && (
        <div className="space-y-8 sm:space-y-12 mb-12">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Needs Attention</h2>
            <p className="text-sm text-gray-600">Categories with unread messages or pending replies</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {priorityCategories.map((category) => (
              <EmailCategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      )}

      {/* Non-Priority Categories Section */}
      {nonPriorityCategories.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">All Caught Up</h2>
            <p className="text-sm text-gray-600">Categories with no urgent items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nonPriorityCategories.map((category) => (
              <CompactCategoryItem
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show message if no categories after filtering */}
      {filteredCategories.length === 0 && searchQuery.trim() && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found matching your search.</p>
        </div>
      )}
    </>
  );
};

export default EmailCategoryGrid;
