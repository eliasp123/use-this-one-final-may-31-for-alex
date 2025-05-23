
import React, { useState } from 'react';
import SummarySection from './dashboard/SummarySection';
import EmailCategoryGrid from './dashboard/EmailCategoryGrid';
import { useEmailCategoryData } from '../hooks/useEmailCategoryData';

interface EmailDashboardProps {
  searchQuery?: string;
}

const EmailDashboard: React.FC<EmailDashboardProps> = ({ searchQuery = '' }) => {
  const { totalUnread, totalPending, totalUnresponded, emailCategories } = useEmailCategoryData();
  const itemsPerPage = 6; // 2 rows of 3 cards
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Summary Cards Section */}
      <SummarySection 
        totalUnread={totalUnread} 
        totalPending={totalPending} 
        totalUnresponded={totalUnresponded} 
      />

      {/* Email Category Grid with Pagination */}
      <EmailCategoryGrid 
        categories={emailCategories}
        searchQuery={searchQuery}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default EmailDashboard;
