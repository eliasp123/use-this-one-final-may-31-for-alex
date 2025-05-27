
import { useMemo } from 'react';
import { 
  Building2, 
  Home, 
  Building, 
  Scale, 
  Briefcase, 
  Shield, 
  Activity, 
  CreditCard 
} from 'lucide-react';
import { useFilteredEmailData } from './useFilteredEmailData';
import { getCustomCategories } from '../utils/categoryUtils';

export const useEmailCategoryData = () => {
  const { 
    getFilteredUnreadEmails, 
    getFilteredPendingEmails, 
    getFilteredUnrespondedEmails,
    getFilteredEmailsByCategory 
  } = useFilteredEmailData();

  // Memoize the email categories calculation
  const emailCategories = useMemo(() => {
    // Base predefined categories - Government moved to first position
    const predefinedCategories = [
      {
        id: 'government',
        title: 'Government',
        icon: Building,
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600'
      },
      {
        id: 'senior-living',
        title: 'Senior Living',
        icon: Building2,
        color: 'from-purple-400 to-purple-500',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600'
      },
      {
        id: 'home-care',
        title: 'Home Care',
        icon: Home,
        color: 'from-green-400 to-green-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600'
      },
      {
        id: 'attorneys',
        title: 'Attorneys',
        icon: Scale,
        color: 'from-red-400 to-red-600',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600'
      },
      {
        id: 'other-professionals',
        title: 'Other Professionals',
        icon: Briefcase,
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600'
      },
      {
        id: 'va',
        title: 'VA',
        icon: Shield,
        color: 'from-indigo-400 to-indigo-600',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600'
      },
      {
        id: 'physical-therapy',
        title: 'Physical Therapy',
        icon: Activity,
        color: 'from-teal-400 to-teal-600',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-600'
      },
      {
        id: 'paying-for-care',
        title: 'Paying for Care',
        icon: CreditCard,
        color: 'from-orange-400 to-orange-600',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600'
      }
    ];

    // Get custom categories and add them to the list
    const customCategories = getCustomCategories();
    
    const allCategories = [...predefinedCategories, ...customCategories];

    return allCategories.map(category => {
      const unread = getFilteredUnreadEmails(category.id).length;
      const pending = getFilteredPendingEmails(category.id).length;
      const total = getFilteredEmailsByCategory(category.id).length;

      return {
        ...category,
        unread,
        pending,
        total
      };
    });
  }, [getFilteredUnreadEmails, getFilteredPendingEmails, getFilteredEmailsByCategory]);

  // Calculate totals across all categories
  const totalUnread = useMemo(() => {
    return getFilteredUnreadEmails().length;
  }, [getFilteredUnreadEmails]);

  const totalPending = useMemo(() => {
    return getFilteredPendingEmails().length;
  }, [getFilteredPendingEmails]);

  const totalUnresponded = useMemo(() => {
    return getFilteredUnrespondedEmails().length;
  }, [getFilteredUnrespondedEmails]);

  const refreshCategories = () => {
    // This function can be called to trigger a re-render of categories
    // The useMemo dependencies will handle the actual refresh
  };

  return {
    emailCategories,
    totalUnread,
    totalPending,
    totalUnresponded,
    refreshCategories
  };
};
