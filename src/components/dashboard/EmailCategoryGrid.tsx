
import React from 'react';
import EmailCategoryCard from '../EmailCategoryCard';
import CompactCategoryItem from './CompactCategoryItem';
import AddNewCategoryButton from './AddNewCategoryButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { addCustomCategory } from '@/utils/categoryUtils';
import { useToast } from '@/hooks/use-toast';

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
  onCategoryAdded?: () => void;
}

const EmailCategoryGrid: React.FC<EmailCategoryGridProps> = ({ 
  categories, 
  searchQuery = '', 
  itemsPerPage,
  currentPage = 1,
  showPagination = true,
  onCategoryAdded
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = React.useState(1);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const { toast } = useToast();
  
  // Use external currentPage if provided, otherwise use internal state
  const activePage = currentPage || internalCurrentPage;
  
  // Debug logging to see all categories
  React.useEffect(() => {
    console.log('🔍 All categories in EmailCategoryGrid:', categories.map(c => ({ id: c.id, title: c.title })));
    console.log('🔍 Total categories received:', categories.length);
  }, [categories]);
  
  // When there's a search query, only show categories that have emails
  // When there's no search query, show all categories
  const filteredCategories = searchQuery.trim() 
    ? categories.filter(category => category.total > 0)
    : categories;
  
  console.log('📊 Filtered categories:', filteredCategories.length, 'from', categories.length, 'total');
  
  // Pagination settings: 9 categories per page (3 rows of 3)
  const CATEGORIES_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);
  
  // Calculate which categories to show on current page
  const startIndex = (activePage - 1) * CATEGORIES_PER_PAGE;
  const endIndex = startIndex + CATEGORIES_PER_PAGE;
  const currentPageCategories = filteredCategories.slice(startIndex, endIndex);
  
  // Determine where to place the "Add New Category" button
  const totalCategoriesOnPage = currentPageCategories.length;
  const shouldShowAddButton = activePage > totalPages || 
    (activePage === totalPages && totalCategoriesOnPage < CATEGORIES_PER_PAGE);
  
  let priorityCategories = [];
  let compactCategories = [];
  let addButtonInFirstRow = false;
  let addButtonInCompactRows = false;
  
  if (shouldShowAddButton) {
    if (totalCategoriesOnPage < 3) {
      // Add button goes in first row as a card
      priorityCategories = currentPageCategories;
      addButtonInFirstRow = true;
    } else if (totalCategoriesOnPage < 9) {
      // Add button goes in compact rows
      priorityCategories = currentPageCategories.slice(0, 3);
      compactCategories = currentPageCategories.slice(3);
      addButtonInCompactRows = true;
    }
  } else {
    // No add button, normal layout
    priorityCategories = currentPageCategories.slice(0, 3);
    compactCategories = currentPageCategories.slice(3);
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (!currentPage) {
      setInternalCurrentPage(page);
    }
  };

  const handleAddNewCategory = () => {
    setShowNewCategoryDialog(true);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      try {
        console.log('🆕 Creating category:', newCategoryName.trim());
        const newCategory = addCustomCategory(newCategoryName.trim());
        console.log('✅ Category created successfully:', newCategory);
        
        toast({
          title: "Category Created",
          description: `"${newCategoryName.trim()}" has been added as a new category.`,
        });
        
        // Notify parent component to refresh categories
        if (onCategoryAdded) {
          console.log('🔄 Calling onCategoryAdded to refresh categories');
          onCategoryAdded();
        }
        
        setNewCategoryName('');
        setShowNewCategoryDialog(false);
      } catch (error) {
        console.error('❌ Error creating category:', error);
        toast({
          title: "Error",
          description: "Failed to create category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <>
      {/* Priority Categories Section - Full Cards (First Row Only) */}
      {(priorityCategories.length > 0 || addButtonInFirstRow) && (
        <div className="space-y-8 sm:space-y-12 mb-16">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Organized Emails For Your Review</h2>
          </div>
          
          {/* Pagination - moved under the title */}
          {showPagination && totalPages > 1 && (
            <div className="flex justify-center mb-8">
              <Pagination>
                <PaginationContent>
                  {activePage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(activePage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: Math.max(totalPages, activePage) }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === activePage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {activePage < Math.max(totalPages, activePage) && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(activePage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {priorityCategories.map((category) => (
              <EmailCategoryCard
                key={category.id}
                category={category}
              />
            ))}
            
            {/* Add New Category Button in first row as a card */}
            {addButtonInFirstRow && (
              <AddNewCategoryButton 
                onClick={handleAddNewCategory}
                categoriesInRow={priorityCategories.length}
              />
            )}
          </div>
        </div>
      )}

      {/* Compact Categories Section */}
      {(compactCategories.length > 0 || addButtonInCompactRows) && (
        <div className="space-y-8" data-section="more-categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {compactCategories.map((category) => (
              <CompactCategoryItem
                key={category.id}
                category={category}
              />
            ))}
            
            {/* Add New Category Button in compact rows */}
            {addButtonInCompactRows && (
              <AddNewCategoryButton 
                onClick={handleAddNewCategory}
                categoriesInRow={compactCategories.length % 3}
              />
            )}
          </div>
        </div>
      )}

      {/* Show message if no categories after filtering */}
      {filteredCategories.length === 0 && searchQuery.trim() && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found matching your search.</p>
        </div>
      )}

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-600 font-normal">Create New Category</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateCategory();
                }
              }}
              className="text-gray-800"
            />
            <Button 
              onClick={handleCreateCategory} 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailCategoryGrid;
