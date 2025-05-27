
import React from 'react';
import { addCustomCategory } from '@/utils/categoryUtils';
import { useToast } from '@/hooks/use-toast';
import EmailCategoryGridHeader from './EmailCategoryGridHeader';
import EmailCategoryGridContent from './EmailCategoryGridContent';
import EmailCategoryGridDialog from './EmailCategoryGridDialog';
import EmailCategoryListItem from './EmailCategoryListItem';
import { useEmailCategoryGridLogic } from './useEmailCategoryGridLogic';

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
  const [showNewCategoryDialog, setShowNewCategoryDialog] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  
  // Debug logging to see all categories
  React.useEffect(() => {
    console.log('🔍 All categories in EmailCategoryGrid:', categories.map(c => ({ id: c.id, title: c.title, total: c.total })));
    console.log('🔍 Total categories received:', categories.length);
    console.log('🔍 Search query:', searchQuery);
  }, [categories, searchQuery]);
  
  // Use the categories as they are already filtered by RoleAwareEmailDashboard
  const filteredCategories = categories;
  
  console.log('📊 FIXED - Using pre-filtered categories:', filteredCategories.length, 'categories');
  console.log('📊 FIXED - Category details:', filteredCategories.map(c => ({ title: c.title, total: c.total })));
  
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
  
  console.log('📄 Current page categories:', [...priorityCategories, ...compactCategories].map(c => ({ title: c.title, total: c.total })));

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
      {/* Header with view toggle */}
      {(filteredCategories.length > 0) && (
        <div className="space-y-8 sm:space-y-12 mb-16">
          <EmailCategoryGridHeader
            activePage={activePage}
            totalPages={totalPages}
            showPagination={showPagination}
            onPageChange={handlePageChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Content based on view mode */}
          {viewMode === 'grid' ? (
            <EmailCategoryGridContent
              priorityCategories={priorityCategories}
              compactCategories={compactCategories}
              addButtonInFirstRow={addButtonInFirstRow}
              addButtonInCompactRows={addButtonInCompactRows}
              onAddNewCategory={handleAddNewCategory}
            />
          ) : (
            <div className="space-y-3">
              {[...priorityCategories, ...compactCategories].map((category) => (
                <EmailCategoryListItem
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Show message if no categories after filtering */}
      {filteredCategories.length === 0 && searchQuery.trim() && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found matching your search.</p>
        </div>
      )}

      {/* Debug info when no categories are showing */}
      {filteredCategories.length === 0 && !searchQuery.trim() && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories available.</p>
          <p className="text-xs text-gray-400 mt-2">Debug: {categories.length} total categories received</p>
        </div>
      )}

      <EmailCategoryGridDialog
        isOpen={showNewCategoryDialog}
        onClose={() => setShowNewCategoryDialog(false)}
        newCategoryName={newCategoryName}
        onNameChange={setNewCategoryName}
        onCreateCategory={handleCreateCategory}
      />
    </>
  );
};

export default EmailCategoryGrid;
