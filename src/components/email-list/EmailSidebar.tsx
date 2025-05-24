
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu 
} from '@/components/ui/sidebar';
import { EmailCategory } from '@/hooks/useEmailCategoryData';
import EmailCategoryItem from './EmailCategoryItem';

interface EmailSidebarProps {
  emailCategories: EmailCategory[];
  category: string | undefined;
  activeTab: string;
}

const EmailSidebar: React.FC<EmailSidebarProps> = ({ 
  emailCategories, 
  category, 
  activeTab 
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [orderedCategories, setOrderedCategories] = useState(emailCategories);

  // Update ordered categories when prop changes
  React.useEffect(() => {
    setOrderedCategories(emailCategories);
  }, [emailCategories]);

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetCategoryId) return;

    const newCategories = [...orderedCategories];
    const draggedIndex = newCategories.findIndex(cat => cat.id === draggedItem);
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

  return (
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]" collapsible="icon">
      <SidebarContent className="pt-16">  
        <SidebarGroup className="pt-8">
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
                    draggedItem === cat.id ? 'opacity-50' : ''
                  }`}
                >
                  <EmailCategoryItem 
                    category={cat} 
                    activeCategory={category} 
                    activeTab={activeTab} 
                  />
                </div>
                {/* Add extra space every 3 items */}
                {(index + 1) % 3 === 0 && index < orderedCategories.length - 1 && (
                  <div className="h-4" />
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
