
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { EmailCategory } from '@/hooks/useEmailCategoryData';

interface EmailCategoryItemProps {
  category: EmailCategory;
  activeCategory: string | undefined;
  activeTab: string;
}

const EmailCategoryItem: React.FC<EmailCategoryItemProps> = ({ 
  category, 
  activeCategory, 
  activeTab 
}) => {
  const navigate = useNavigate();
  
  return (
    <SidebarMenuItem className="mb-1.5">
      <SidebarMenuButton 
        isActive={category.id === activeCategory}
        tooltip={category.title}
        onClick={() => navigate(`/emails/${category.id}/${activeTab}`)}
        className="pr-10 relative"
      >
        <div className={`w-6 h-6 rounded-md ${category.bgColor} flex items-center justify-center mr-2`}>
          <category.icon className={`w-4 h-4 ${category.textColor}`} />
        </div>
        <span>{category.title}</span>
        {category.unread > 0 && (
          <Badge 
            variant="circle" 
            className={`absolute right-2 ${category.bgColor}`}
          >
            {category.unread}
          </Badge>
        )}
        {category.pending > 0 && category.unread === 0 && (
          <Badge 
            variant="circle" 
            className={`absolute right-2 ${category.bgColor} bg-opacity-80`}
          >
            {category.pending}
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default EmailCategoryItem;
