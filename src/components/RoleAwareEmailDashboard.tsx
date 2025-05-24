
import React from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useFilteredEmailData } from '../hooks/useFilteredEmailData';
import SummarySection from './dashboard/SummarySection';
import EmailCategoryGrid from './dashboard/EmailCategoryGrid';
import { Alert, AlertDescription } from './ui/alert';
import { Info, Calendar } from 'lucide-react';
import { 
  Heart, Home, Shield, Scale, 
  Users, Award, Activity, CreditCard 
} from 'lucide-react';

interface RoleAwareEmailDashboardProps {
  searchQuery?: string;
}

// Map category IDs to their respective icons
const categoryIconMap: Record<string, React.ElementType> = {
  'senior-living': Heart,
  'home-care': Home,
  'government': Shield,
  'attorneys': Scale,
  'other-professionals': Users,
  'va': Award,
  'physical-therapy': Activity,
  'paying-for-care': CreditCard
};

// Map category IDs to their colors
const categoryColorMap: Record<string, { color: string, bgColor: string, textColor: string }> = {
  'senior-living': {
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700'
  },
  'home-care': {
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  'government': {
    color: 'from-emerald-400 to-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700'
  },
  'attorneys': {
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700'
  },
  'other-professionals': {
    color: 'from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700'
  },
  'va': {
    color: 'from-teal-400 to-teal-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700'
  },
  'physical-therapy': {
    color: 'from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700'
  },
  'paying-for-care': {
    color: 'from-lime-400 to-lime-500',
    bgColor: 'bg-lime-50',
    textColor: 'text-lime-700'
  }
};

// Map category IDs to their display titles
const categoryTitleMap: Record<string, string> = {
  'senior-living': 'Senior Living',
  'home-care': 'Home Care',
  'government': 'Government',
  'attorneys': 'Attorneys',
  'other-professionals': 'Other Professionals',
  'va': 'VA',
  'physical-therapy': 'Physical Therapy',
  'paying-for-care': 'Paying for Care'
};

// Function to filter emails by search query
const filterEmailsBySearch = (emails: any[], searchQuery: string) => {
  if (!searchQuery.trim()) return emails;
  
  const query = searchQuery.toLowerCase();
  return emails.filter(email => 
    email.subject.toLowerCase().includes(query) ||
    email.sender.name.toLowerCase().includes(query) ||
    email.sender.organization.toLowerCase().includes(query) ||
    email.content.toLowerCase().includes(query)
  );
};

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

  // Apply search filtering to all email categories
  const searchFilteredEmailsByCategory = Object.entries(filteredEmailsByCategory).reduce((acc, [category, emails]) => {
    acc[category] = filterEmailsBySearch(emails, searchQuery);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate totals based on search-filtered emails
  const allSearchFilteredEmails = Object.values(searchFilteredEmailsByCategory).flat();
  const totalUnread = allSearchFilteredEmails.filter(email => !email.read).length;
  const totalPending = allSearchFilteredEmails.filter(email => !email.replied && email.read).length;
  const totalUnresponded = allSearchFilteredEmails.filter(email => email.replied && !email.responseReceived).length;

  // Transform filtered emails by category into the format expected by EmailCategoryGrid
  const emailCategories = Object.entries(searchFilteredEmailsByCategory).map(([category, emails]) => {
    const unreadCount = emails.filter(email => !email.read).length;
    const pendingCount = emails.filter(email => !email.replied && email.read).length;
    
    return {
      id: category,
      title: categoryTitleMap[category] || category,
      icon: categoryIconMap[category] || Users,
      unread: unreadCount,
      pending: pendingCount,
      total: emails.length,
      color: categoryColorMap[category]?.color || 'from-gray-400 to-gray-500',
      bgColor: categoryColorMap[category]?.bgColor || 'bg-gray-50',
      textColor: categoryColorMap[category]?.textColor || 'text-gray-700'
    };
  });

  const itemsPerPage = 6; // 2 rows of 3 cards
  
  // Check if we have search results
  const totalEmailsFound = emailCategories.reduce((sum, category) => sum + category.total, 0);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasNoEmailResults = hasSearchQuery && totalEmailsFound === 0;
  
  // Debug logging
  console.log('Search debug:', {
    searchQuery,
    hasSearchQuery,
    totalEmailsFound,
    hasNoEmailResults,
    emailCategories: emailCategories.length
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Show explanation when search has no email results */}
      {hasNoEmailResults && (
        <div className="mb-8">
          <Alert className="border-0 bg-orange-50 text-gray-800">
            <Calendar className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-gray-800 text-center ml-6">
              No emails found for "{searchQuery}". However, you may have related appointments in the calendar below.
            </AlertDescription>
          </Alert>
        </div>
      )}

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
