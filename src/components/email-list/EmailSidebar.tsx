
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarMenu } from '../ui/sidebar';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import ShowAllEmailsButton from './sidebar/ShowAllEmailsButton';
import DraggableCategoryList from './sidebar/DraggableCategoryList';
import AddCategoryDialog from './sidebar/AddCategoryDialog';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { useCategoryDragDrop } from './sidebar/useCategoryDragDrop';

interface EmailSidebarProps {
  emailCategories: EmailCategory[];
  category?: string;
  activeTab: string;
  onCategoryAdded: () => void;
  onCalendarClick?: () => void;
  onCalendarHover?: () => void;
}

const EmailSidebar = ({ 
  emailCategories, 
  category, 
  activeTab, 
  onCategoryAdded,
  onCalendarClick,
  onCalendarHover 
}: EmailSidebarProps) => {
  const {
    orderedCategories,
    draggedItem,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useCategoryDragDrop(emailCategories);

  const handleCalendarHover = () => {
    console.log('EmailSidebar: Calendar button hovered');
    if (onCalendarHover) {
      console.log('EmailSidebar: Calling onCalendarHover');
      onCalendarHover();
    }
  };

  const handleCalendarClick = () => {
    console.log('EmailSidebar: Calendar button clicked');
    if (onCalendarClick) {
      console.log('EmailSidebar: Calling onCalendarClick');
      onCalendarClick();
    }
  };

  return (
    <Sidebar side="left" className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          {(onCalendarClick || onCalendarHover) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCalendarClick}
              onMouseEnter={handleCalendarHover}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            <ShowAllEmailsButton category={category} activeTab={activeTab} />
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
            <AddCategoryDialog onCategoryAdded={onCategoryAdded} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmailSidebar;
