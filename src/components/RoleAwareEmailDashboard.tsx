
import React from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useFilteredEmailData } from '../hooks/useFilteredEmailData';
import SummarySection from './dashboard/SummarySection';
import EmailCategoryGrid from './dashboard/EmailCategoryGrid';
import { Badge } from './ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface RoleAwareEmailDashboardProps {
  searchQuery?: string;
}

const RoleAwareEmailDashboard: React.FC<RoleAwareEmailDashboardProps> = ({ 
  searchQuery = '' 
}) => {
  const { userRole } = useUserRole();
  const {
    getFilteredUnreadEmails,
    getFilteredPendingEmails,
    getFilteredUnrespondedEmails,
    filteredEmailsByCategory
  } = useFilteredEmailData();

  const totalUnread = getFilteredUnreadEmails().length;
  const totalPending = getFilteredPendingEmails().length;
  const totalUnresponded = getFilteredUnrespondedEmails().length;

  // Transform filtered emails by category into the format expected by EmailCategoryGrid
  const emailCategories = Object.entries(filteredEmailsByCategory).map(([category, emails]) => ({
    category,
    emails,
    unread: emails.filter(email => !email.read).length,
    pending: emails.filter(email => !email.replied && email.read).length,
    unresponded: emails.filter(email => email.replied && !email.responseReceived).length
  }));

  const itemsPerPage = 6; // 2 rows of 3 cards
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Role Indicator */}
      <div className="mb-6 flex justify-center">
        <Badge 
          variant={userRole === 'primary-caregiver' ? 'default' : 'secondary'}
          className="flex items-center gap-2"
        >
          {userRole === 'primary-caregiver' ? (
            <>
              <Eye className="h-3 w-3" />
              Primary Caregiver View
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" />
              Family Member View (Private emails hidden)
            </>
          )}
        </Badge>
      </div>

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

export default RoleAwareEmailDashboard;
