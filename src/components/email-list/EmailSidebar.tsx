
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup
} from '@/components/ui/sidebar';
import { EmailCategory } from '@/hooks/useEmailCategoryData';
import { useCategoryDragDrop } from './sidebar/useCategoryDragDrop';
import AddCategoryDialog from './sidebar/AddCategoryDialog';
import ShowAllEmailsButton from './sidebar/ShowAllEmailsButton';
import DraggableCategoryList from './sidebar/DraggableCategoryList';

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
  const {
    draggedItem,
    dragOverIndex,
    orderedCategories,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useCategoryDragDrop(emailCategories);

  return (
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]" collapsible="icon">
      <SidebarContent className="pt-16 pl-4">  
        <SidebarGroup className="pt-8">
          <ShowAllEmailsButton category={category} activeTab={activeTab} />
          <AddCategoryDialog onCategoryAdded={onCategoryAdded} />
          
          <div className="pt-8">
            <DraggableCategoryList
              orderedCategories={orderedCategories}
              category={category}
              activeTab={activeTab}
              draggedItem={draggedItem}
              dragOverIndex={dragOverIndex}
              onCategoryAdded={onCategoryAdded}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmailSidebar;
