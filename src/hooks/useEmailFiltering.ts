
import { useState, useEffect } from 'react';
import { EmailData } from '@/types/email';
import { useUserRole } from './useUserRole';
import { 
  getEmailsByCategory, 
  getUnreadEmails, 
  getPendingEmails, 
  getUnrespondedEmails, 
  getAllEmails 
} from '@/data/emailData';

interface UseEmailFilteringProps {
  category?: string;
  activeTab: string;
  searchQuery: string;
}

export const useEmailFiltering = ({ category, activeTab, searchQuery }: UseEmailFilteringProps) => {
  const { userRole } = useUserRole();
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailData[]>([]);
  
  // Filter private emails based on user role
  const filterPrivateEmails = (emailList: EmailData[]): EmailData[] => {
    if (userRole === 'primary-caregiver') {
      return emailList; // Primary caregivers see all emails
    }
    return emailList.filter(email => !email.private); // Family members only see non-private emails
  };
  
  // Load emails based on category and activeTab
  useEffect(() => {
    loadEmails();
  }, [category, activeTab, userRole]);

  // Filter emails based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = emails.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails(emails);
    }
  }, [searchQuery, emails]);

  const loadEmails = () => {
    let fetchedEmails: EmailData[] = [];
    
    if (category) {
      // If category is specified, filter by category first
      switch (activeTab) {
        case 'unread':
          fetchedEmails = getUnreadEmails(category);
          break;
        case 'pending':
          fetchedEmails = getPendingEmails(category);
          break;
        case 'unresponded':
          fetchedEmails = getUnrespondedEmails(category);
          break;
        default:
          fetchedEmails = getEmailsByCategory(category);
      }
    } else {
      // If no category, just filter by status
      switch (activeTab) {
        case 'unread':
          fetchedEmails = getUnreadEmails();
          break;
        case 'pending':
          fetchedEmails = getPendingEmails();
          break;
        case 'unresponded':
          fetchedEmails = getUnrespondedEmails();
          break;
        default:
          fetchedEmails = getAllEmails();
      }
    }
    
    // Filter private emails based on user role
    fetchedEmails = filterPrivateEmails(fetchedEmails);
    
    // Sort by date (newest first)
    fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEmails(fetchedEmails);
    setFilteredEmails(fetchedEmails);
  };

  return { emails, filteredEmails };
};
