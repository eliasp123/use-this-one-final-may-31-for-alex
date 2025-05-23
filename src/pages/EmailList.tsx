import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useEmailCategoryData } from '@/hooks/useEmailCategoryData';
import { useEmailFiltering } from '@/hooks/useEmailFiltering';
import { useEmailFormatter } from '@/hooks/useEmailFormatter';
import { categoryInfo } from '@/utils/categoryUtils';
import EmailSidebar from '@/components/email-list/EmailSidebar';
import EmailHeader from '@/components/email-list/EmailHeader';
import EmailListToolbar from '@/components/email-list/EmailListToolbar';
import EmailTable from '@/components/email-list/EmailTable';

const EmailList = () => {
  const { category, status } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(status || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const { emailCategories } = useEmailCategoryData();
  const { formatDate } = useEmailFormatter();
  const { filteredEmails } = useEmailFiltering({ 
    category, 
    activeTab, 
    searchQuery 
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL to reflect the new status without changing the category
    navigate(`/emails/${category || 'all'}/${value}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Get info for current category
  const currentCategory = category ? categoryInfo[category] : null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex w-full">
        {/* Sidebar */}
        <EmailSidebar 
          emailCategories={emailCategories} 
          category={category} 
          activeTab={activeTab}
        />
        
        {/* Main Content - Updated padding to pl-20 */}
        <div className="flex-1 pl-22 pr-20">
          <div className="py-8">
            <EmailHeader 
              currentCategory={currentCategory}
              emailCount={filteredEmails.length}
              activeTab={activeTab}
            />
            
            <EmailListToolbar 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchQuery={searchQuery}
              onSearch={handleSearch}
            />
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
              <EmailTable 
                emails={filteredEmails}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmailList;
