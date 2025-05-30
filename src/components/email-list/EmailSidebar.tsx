
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarMenu } from '../ui/sidebar';
import { EmailCategoryData } from '../../types/email';
import ShowAllEmailsButton from './sidebar/ShowAllEmailsButton';
import DraggableCategoryList from './sidebar/DraggableCategoryList';
import AddCategoryDialog from './sidebar/AddCategoryDialog';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';

interface EmailSidebarProps {
  emailCategories: EmailCategoryData[];
  category?: string;
  activeTab: string;
  onCategoryAdded: () => void;
  onCalendarClick?: () => void;
}

const EmailSidebar = ({ 
  emailCategories, 
  category, 
  activeTab, 
  onCategoryAdded,
  onCalendarClick 
}: EmailSidebarProps) => {
  return (
    <Sidebar side="left" className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          {onCalendarClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCalendarClick}
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
              emailCategories={emailCategories} 
              category={category} 
              activeTab={activeTab}
            />
            <AddCategoryDialog onCategoryAdded={onCategoryAdded} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmailSidebar;
