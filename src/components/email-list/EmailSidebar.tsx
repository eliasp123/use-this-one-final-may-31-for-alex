
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
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]" collapsible="icon">
      <SidebarContent className="pt-6">  
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 mb-5">Categories</SidebarGroupLabel> {/* Increased from mb-3 to mb-5 */}
          <SidebarMenu className="space-y-3"> {/* Changed from space-y-1.5 to space-y-3 for consistent spacing */}
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
