
import React from 'react';
import EmailCategoryCard from '../EmailCategoryCard';
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
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCategories.length);
  const currentCategories = filteredCategories.slice(startIndex, endIndex);
  
  // Handle page change (only used when showPagination is true and no external currentPage)
  const handlePageChange = (page: number) => {
    if (!currentPage) {
      setInternalCurrentPage(page);
    }
    // Scroll to top of category section for better UX
    document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Split the current categories into rows of 3 for consistent spacing
  const rows = [];
  for (let i = 0; i < currentCategories.length; i += 3) {
    rows.push(currentCategories.slice(i, i + 3));
  }
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <>
      {/* Email Category Grid with increased spacing by 4px */}
      <div id="category-section" className="space-y-8 sm:space-y-12">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {row.map((category) => (
              <EmailCategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Pagination - Only show if showPagination is true and we have more than one page */}
      {showPagination && totalPages > 1 && (
        <Pagination className="mt-8 sm:mt-12">
          <PaginationContent>
            {activePage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(activePage - 1);
                  }} 
                />
              </PaginationItem>
            )}
            
            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={page === activePage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {activePage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(activePage + 1);
                  }} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default EmailCategoryGrid;
