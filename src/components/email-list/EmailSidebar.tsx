
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { EmailCategory } from '@/hooks/useEmailCategoryData';
import EmailCategoryItem from './EmailCategoryItem';
import { addCustomCategory, getCustomCategories, saveCustomCategories } from '@/utils/categoryUtils';
import { useToast } from '@/hooks/use-toast';

interface EmailSidebarProps {
  emailCategories: EmailCategory[];
  category: string | undefined;
  activeTab: string;
  onCategoryAdded?: () => void;
}

const EmailSidebar: React.FC<EmailSidebarProps> = ({ 
  emailCategories, 
  category, 
  activeTab,
  onCategoryAdded 
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [orderedCategories, setOrderedCategories] = useState(emailCategories);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { toast } = useToast();

  // Update ordered categories when prop changes
  React.useEffect(() => {
    setOrderedCategories(emailCategories);
  }, [emailCategories]);

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', categoryId);
    
    // Set drag image to be slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem && index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over index if we're leaving the entire drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain') || draggedItem;
    
    if (!draggedId) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newCategories = [...orderedCategories];
    const draggedIndex = newCategories.findIndex(cat => cat.id === draggedId);

    if (draggedIndex !== -1 && targetIndex !== draggedIndex) {
      const [draggedCategory] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(targetIndex, 0, draggedCategory);
      setOrderedCategories(newCategories);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleAddCustomCategory = () => {
    if (newCategoryName.trim()) {
      try {
        addCustomCategory(newCategoryName.trim());
        setNewCategoryName('');
        setShowNewCategoryDialog(false);
        
        toast({
          title: "Category Created",
          description: `"${newCategoryName.trim()}" has been added as a new category.`,
        });
        
        // Notify parent component to refresh categories
        if (onCategoryAdded) {
          onCategoryAdded();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = orderedCategories.find(cat => cat.id === categoryId);
    
    // Check if category is empty (no unread, pending, or total emails)
    if (categoryToDelete && categoryToDelete.total === 0) {
      try {
        // Remove from custom categories in localStorage
        const customCategories = getCustomCategories();
        const filteredCategories = customCategories.filter(cat => cat.id !== categoryId);
        saveCustomCategories(filteredCategories);
        
        toast({
          title: "Category Deleted",
          description: `"${categoryToDelete.title}" has been deleted.`,
        });
        
        // Notify parent component to refresh categories
        if (onCategoryAdded) {
          onCategoryAdded();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Cannot Delete",
        description: "Only empty categories can be deleted.",
        variant: "destructive",
      });
    }
  };

  // Check if a category is a custom category and is empty
  const isCustomEmptyCategory = (categoryId: string) => {
    const customCategories = getCustomCategories();
    const isCustom = customCategories.some(cat => cat.id === categoryId);
    const categoryData = orderedCategories.find(cat => cat.id === categoryId);
    return isCustom && categoryData && categoryData.total === 0;
  };

  return (
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]" collapsible="icon">
      <SidebarContent className="pt-16">  
        <SidebarGroup className="pt-8">
          {/* Add Category Button with increased bottom margin */}
          <div className="px-3 mb-8">
            <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-800 font-normal">Create New Category</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    className="text-gray-800"
                  />
                  <Button 
                    onClick={handleAddCustomCategory} 
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <SidebarMenu className="space-y-1">
            {orderedCategories.map((cat, index) => {
              const isDragging = draggedItem === cat.id;
              const isDropTarget = dragOverIndex === index;
              const canDelete = isCustomEmptyCategory(cat.id);
              
              return (
                <div key={cat.id} className="relative">
                  {/* Drop indicator line above */}
                  {isDropTarget && draggedItem !== cat.id && (
                    <div className="absolute -top-1 left-3 right-3 h-0.5 bg-purple-500 rounded-full z-10" />
                  )}
                  
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, cat.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-move transition-all duration-200 ${
                      isDragging ? 'scale-95 rotate-1 shadow-lg z-20' : ''
                    } ${isDropTarget && !isDragging ? 'transform translate-y-1' : ''} ${
                      canDelete ? 'group relative' : ''
                    }`}
                  >
                    <EmailCategoryItem 
                      category={cat} 
                      activeCategory={category} 
                      activeTab={activeTab} 
                    />
                    
                    {/* Delete button for custom empty categories */}
                    {canDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded"
                        title="Delete category"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    )}
                  </div>
                  
                  {/* Add extra space every 3 items with increased spacing */}
                  {(index + 1) % 3 === 0 && index < orderedCategories.length - 1 && (
                    <div className="h-8" />
                  )}
                </div>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmailSidebar;
