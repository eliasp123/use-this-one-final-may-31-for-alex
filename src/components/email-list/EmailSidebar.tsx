
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
import { Plus, FolderPlus } from 'lucide-react';
import { EmailCategory } from '@/hooks/useEmailCategoryData';
import EmailCategoryItem from './EmailCategoryItem';
import { addCustomCategory } from '@/utils/categoryUtils';
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain') || draggedItem;
    
    if (!draggedId || draggedId === targetCategoryId) {
      setDraggedItem(null);
      return;
    }

    const newCategories = [...orderedCategories];
    const draggedIndex = newCategories.findIndex(cat => cat.id === draggedId);
    const targetIndex = newCategories.findIndex(cat => cat.id === targetCategoryId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedCategory] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(targetIndex, 0, draggedCategory);
      setOrderedCategories(newCategories);
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
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
                  <DialogTitle>Create New Category</DialogTitle>
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
                  />
                  <Button onClick={handleAddCustomCategory} size="sm">
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <SidebarMenu className="space-y-1">
            {orderedCategories.map((cat, index) => (
              <div key={cat.id}>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, cat.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, cat.id)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-all ${
                    draggedItem === cat.id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <EmailCategoryItem 
                    category={cat} 
                    activeCategory={category} 
                    activeTab={activeTab} 
                  />
                </div>
                {/* Add extra space every 3 items with increased spacing */}
                {(index + 1) % 3 === 0 && index < orderedCategories.length - 1 && (
                  <div className="h-8" />
                )}
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmailSidebar;
