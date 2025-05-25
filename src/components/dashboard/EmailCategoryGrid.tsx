
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
  
  // Split categories: first 3 as priority (full cards), rest as compact
  const priorityCategories = filteredCategories.slice(0, 3);
  const compactCategories = filteredCategories.slice(3);
  
  console.log('Priority split:', {
    priorityCount: priorityCategories.length,
    compactCount: compactCategories.length,
    priorityCategories: priorityCategories.map(c => ({ id: c.id, unread: c.unread, pending: c.pending })),
    compactCategories: compactCategories.map(c => ({ id: c.id, unread: c.unread, pending: c.pending }))
  });
  
  // Handle page change (only used when showPagination is true and no external currentPage)
  const handlePageChange = (page: number) => {
    if (!currentPage) {
      setInternalCurrentPage(page);
    }
  };
  
  return (
    <>
      {/* Priority Categories Section - Full Cards (First Row Only) */}
      {priorityCategories.length > 0 && (
        <div className="space-y-8 sm:space-y-12 mb-12">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Needs Attention</h2>
            <p className="text-sm text-gray-600">Your most important email categories</p>
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

      {/* Compact Categories Section - Accordion Items (Additional Categories) */}
      {compactCategories.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">More Categories</h2>
            <p className="text-sm text-gray-600">Additional email categories</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {compactCategories.map((category) => (
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
