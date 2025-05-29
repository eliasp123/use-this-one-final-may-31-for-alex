
import { useMemo } from 'react';
import { useUserRole } from './useUserRole';
import { EmailData } from '../types/email';
import { 
  getEmailsByCategory, 
  getUnreadEmails, 
  getPendingEmails, 
  getUnrespondedEmails, 
  getAllEmails 
} from '../data/emailData';

export const useFilteredEmailData = () => {
  const { userRole } = useUserRole();

  const filterPrivateEmails = (emails: EmailData[]): EmailData[] => {
    if (userRole === 'primary-caregiver') {
      return emails; // Primary caregivers see all emails
    }
    return emails.filter(email => !email.private); // Family members only see non-private emails
  };

  const filteredEmailsByCategory = useMemo(() => {
    const categories = [
      'attorneys',
      'other-professionals', 
      'paying-for-care',
      'home-care',
      'physical-therapy',
      'senior-living',
      'government-va',
      'hospitals',
      'pharmacies'
    ] as const;

    return categories.reduce((acc, category) => {
      // For government-va, combine government and va emails
      if (category === 'government-va') {
        const governmentEmails = getEmailsByCategory('government');
        const vaEmails = getEmailsByCategory('va');
        acc[category] = filterPrivateEmails([...governmentEmails, ...vaEmails]);
      } else {
        acc[category] = filterPrivateEmails(getEmailsByCategory(category));
      }
      return acc;
    }, {} as Record<string, EmailData[]>);
  }, [userRole]);

  const getFilteredEmailsByCategory = (category: string) => {
    // Handle the combined government-va category
    if (category === 'government-va') {
      const governmentEmails = getEmailsByCategory('government');
      const vaEmails = getEmailsByCategory('va');
      return filterPrivateEmails([...governmentEmails, ...vaEmails]);
    }
    return filterPrivateEmails(getEmailsByCategory(category));
  };

  const getFilteredUnreadEmails = (category?: string) => {
    if (category === 'government-va') {
      const governmentUnread = getUnreadEmails('government');
      const vaUnread = getUnreadEmails('va');
      return filterPrivateEmails([...governmentUnread, ...vaUnread]);
    }
    return filterPrivateEmails(getUnreadEmails(category));
  };

  const getFilteredPendingEmails = (category?: string) => {
    if (category === 'government-va') {
      const governmentPending = getPendingEmails('government');
      const vaPending = getPendingEmails('va');
      return filterPrivateEmails([...governmentPending, ...vaPending]);
    }
    return filterPrivateEmails(getPendingEmails(category));
  };

  const getFilteredUnrespondedEmails = (category?: string) => {
    if (category === 'government-va') {
      const governmentUnresponded = getUnrespondedEmails('government');
      const vaUnresponded = getUnrespondedEmails('va');
      return filterPrivateEmails([...governmentUnresponded, ...vaUnresponded]);
    }
    return filterPrivateEmails(getUnrespondedEmails(category));
  };

  const getFilteredAllEmails = () => {
    return filterPrivateEmails(getAllEmails());
  };

  const getFilteredEmailData = () => {
    return filterPrivateEmails(getAllEmails());
  };

  return {
    filteredEmailsByCategory,
    getFilteredEmailsByCategory,
    getFilteredUnreadEmails,
    getFilteredPendingEmails,
    getFilteredUnrespondedEmails,
    getFilteredAllEmails,
    getFilteredEmailData
  };
};
