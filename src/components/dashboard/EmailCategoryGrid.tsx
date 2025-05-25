
import React from 'react';
import EmailCategoryCard from '../EmailCategoryCard';
import CompactCategoryItem from './CompactCategoryItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus } from 'lucide-react';
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
  
  // Use external currentPage if provided, otherwise use internal state
  const activePage = currentPage || internalCurrentPage;
  
  // When there's a search query, only show categories that have emails
  // When there's no search query, show all categories
  const filteredCategories = searchQuery.trim() 
    ? categories.filter(category => category.total > 0)
    : categories;
  
  // Split categories: first 3 as priority (full cards), rest as compact
  const priorityCategories = filteredCategories.slice(0, 3);
  const compactCategories = filteredCategories.slice(3);
  
  // Handle page change (only used when showPagination is true and no external currentPage)
  const handlePageChange = (page: number) => {
    if (!currentPage) {
      setInternalCurrentPage(page);
    }
  };

  // Task 3: Handle segmented button clicks
  const handleViewMoreCategories = () => {
    const moreCategoriesSection = document.querySelector('[data-section="more-categories"]');
    if (moreCategoriesSection) {
      moreCategoriesSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleAddNewCategory = () => {
    setShowNewCategoryDialog(true);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim() && onCategoryAdded) {
      // This would integrate with the actual category creation logic
      onCategoryAdded();
      setNewCategoryName('');
      setShowNewCategoryDialog(false);
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

      {/* Compact Categories Section - Task 3 & 4: Redesigned with new button, no subheader */}
      {compactCategories.length > 0 && (
        <div className="space-y-6" data-section="more-categories">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800 mb-6">More Categories</h2>
            {/* Task 4: Removed "Additional email categories" subheader */}
          </div>
          
          {/* Task 3: Redesigned segmented button */}
          <div className="flex justify-start mb-8">
            <div className="w-full max-w-md">
              <button 
                className="w-full flex items-center justify-center border border-purple-600 rounded-md bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                onClick={handleViewMoreCategories}
              >
                <span 
                  className="px-4 py-2 text-sm font-medium flex-1 hover:bg-purple-600 transition-colors rounded-l-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMoreCategories();
                  }}
                >
                  View More Categories Below
                </span>
                <span className="border-l border-purple-400 h-6"></span>
                <span 
                  className="px-4 py-2 text-sm font-medium flex-1 hover:bg-purple-600 transition-colors rounded-r-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNewCategory();
                  }}
                >
                  Add New Category
                </span>
              </button>
            </div>
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
