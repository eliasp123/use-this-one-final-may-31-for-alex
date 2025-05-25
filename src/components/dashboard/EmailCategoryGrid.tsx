
import React from 'react';
import EmailCategoryCard from '../EmailCategoryCard';
import CompactCategoryItem from './CompactCategoryItem';
import AddNewCategoryButton from './AddNewCategoryButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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

  const handleAddNewCategory = () => {
    setShowNewCategoryDialog(true);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      try {
        addCustomCategory(newCategoryName.trim());
        
        toast({
          title: "Category Created",
          description: `"${newCategoryName.trim()}" has been added as a new category.`,
        });
        
        // Notify parent component to refresh categories
        if (onCategoryAdded) {
          onCategoryAdded();
        }
        
        setNewCategoryName('');
        setShowNewCategoryDialog(false);
      } catch (error) {
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
      {priorityCategories.length > 0 && (
        <div className="space-y-8 sm:space-y-12 mb-16">
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

      {/* Compact Categories Section */}
      {compactCategories.length > 0 && (
        <div className="space-y-8" data-section="more-categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {compactCategories.map((category) => (
              <CompactCategoryItem
                key={category.id}
                category={category}
              />
            ))}
            
            {/* Dynamic Add New Category Button */}
            <AddNewCategoryButton 
              onClick={handleAddNewCategory}
              categoriesInRow={compactCategories.length % 3}
            />
          </div>
        </div>
      )}

      {/* If no compact categories, show add button after priority categories */}
      {compactCategories.length === 0 && priorityCategories.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <AddNewCategoryButton 
              onClick={handleAddNewCategory}
              categoriesInRow={priorityCategories.length % 3}
            />
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
