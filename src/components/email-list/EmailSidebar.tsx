
import React from 'react';
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
  return (
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]" collapsible="icon">
      <SidebarContent className="pt-16">  
        <SidebarGroup className="pt-8">
          <SidebarMenu className="space-y-3">
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
