
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useEmailCategoryData } from '@/hooks/useEmailCategoryData';
import { useEmailFiltering } from '@/hooks/useEmailFiltering';
import { useEmailFormatter } from '@/hooks/useEmailFormatter';
import { getAllCategories } from '@/utils/categoryUtils';
import EmailSidebar from '@/components/email-list/EmailSidebar';
import EmailHeader from '@/components/email-list/EmailHeader';
import EmailListToolbar from '@/components/email-list/EmailListToolbar';
import EmailTable from '@/components/email-list/EmailTable';
import CalendarSection from '@/components/CalendarSection';
import NewEmailForm from '@/components/NewEmailForm';
import { useToast } from '@/hooks/use-toast';

const EmailList = () => {
  const { category, status } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(status || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const { emailCategories, refreshCategories } = useEmailCategoryData();
  const { formatDate } = useEmailFormatter();
  const { filteredEmails } = useEmailFiltering({ 
    category, 
    activeTab, 
    searchQuery 
  });
  const { toast } = useToast();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL to reflect the new status without changing the category
    navigate(`/emails/${category || 'all'}/${value}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewEmail = (emailData: any) => {
    // This is where you'll integrate with actual email sending
    console.log('New email to be sent:', emailData);
    
    toast({
      title: "Email Sent",
      description: `Email sent to ${emailData.toName} at ${emailData.toOrganization}`,
    });
  };

  const handleCategoryAdded = () => {
    refreshCategories();
  };

  // Get info for current category
  const allCategories = getAllCategories();
  const currentCategory = category ? allCategories[category] : null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex w-full">
        {/* Sidebar */}
        <EmailSidebar 
          emailCategories={emailCategories} 
          category={category} 
          activeTab={activeTab}
          onCategoryAdded={handleCategoryAdded}
        />
        
        {/* Main Content */}
        <div className="flex-1 pl-24 pr-32 pt-16">
          <div className="py-8">
            <EmailHeader 
              currentCategory={currentCategory}
              emailCount={filteredEmails.length}
              activeTab={activeTab}
              onComposeClick={() => setShowNewEmailForm(true)}
            />
            
            <EmailListToolbar 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onComposeClick={() => setShowNewEmailForm(true)}
            />
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
              <EmailTable 
                emails={filteredEmails}
                formatDate={formatDate}
              />
            </div>
            
            {/* Calendar Section - Added to the bottom */}
            <div className="mt-16 mb-24">
              <CalendarSection />
            </div>
          </div>
        </div>

        {/* New Email Form */}
        <NewEmailForm
          isOpen={showNewEmailForm}
          onClose={() => setShowNewEmailForm(false)}
          onSend={handleNewEmail}
        />
      </div>
    </SidebarProvider>
  );
};

export default EmailList;
