
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
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
  return (
    <Sidebar variant="sidebar" className="min-w-[220px] max-w-[260px]" collapsible="icon">
      <SidebarContent className="pt-6">  
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 mb-2">Categories</SidebarGroupLabel>
          <SidebarMenu>
            {emailCategories.map((cat) => (
              <EmailCategoryItem 
                key={cat.id} 
                category={cat} 
                activeCategory={category} 
                activeTab={activeTab} 
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmailSidebar;
