
import { useEffect, useState } from 'react';
import { getUnreadEmails, getPendingEmails, getUnrespondedEmails } from '../data/emailData';
import { Heart, Home, Shield, Building, Scale, Users, Award, Activity, CreditCard } from 'lucide-react';

export interface EmailCategory {
  id: string;
  title: string;
  icon: any;
  unread: number;
  pending: number;
  total: number;
  color: string;
  bgColor: string;
  textColor: string;
}

export const useEmailCategoryData = () => {
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalUnresponded, setTotalUnresponded] = useState(0);
  const [emailCategories, setEmailCategories] = useState<EmailCategory[]>([]);

  // Load email counts and categories
  useEffect(() => {
    setTotalUnread(getUnreadEmails().length);
    setTotalPending(getPendingEmails().length);
    setTotalUnresponded(getUnrespondedEmails().length);
    
    const categories = [
      {
        id: 'senior-living',
        title: 'Senior Living',
        icon: Heart,
        unread: getUnreadEmails('senior-living').length,
        pending: getPendingEmails('senior-living').length,
        total: 12,
        color: 'from-rose-400 to-pink-500',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700'
      },
      {
        id: 'home-care',
        title: 'Home Care',
        icon: Home,
        unread: getUnreadEmails('home-care').length,
        pending: getPendingEmails('home-care').length,
        total: 8,
        color: 'from-blue-400 to-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      {
        id: 'federal-benefits',
        title: 'Federal Benefits',
        icon: Shield,
        unread: getUnreadEmails('federal-benefits').length,
        pending: getPendingEmails('federal-benefits').length,
        total: 15,
        color: 'from-emerald-400 to-emerald-500',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700'
      },
      {
        id: 'local-government',
        title: 'Local Government',
        icon: Building,
        unread: getUnreadEmails('local-government').length,
        pending: getPendingEmails('local-government').length,
        total: 6,
        color: 'from-purple-400 to-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      },
      {
        id: 'attorneys',
        title: 'Attorneys',
        icon: Scale,
        unread: getUnreadEmails('attorneys').length,
        pending: getPendingEmails('attorneys').length,
        total: 9,
        color: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700'
      },
      {
        id: 'other-professionals',
        title: 'Other Professionals',
        icon: Users,
        unread: getUnreadEmails('other-professionals').length,
        pending: getPendingEmails('other-professionals').length,
        total: 9,
        color: 'from-indigo-400 to-indigo-500',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700'
      },
      {
        id: 'va',
        title: 'VA',
        icon: Award,
        unread: getUnreadEmails('va').length,
        pending: getPendingEmails('va').length,
        total: 7,
        color: 'from-teal-400 to-teal-500',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-700'
      },
      {
        id: 'physical-therapy',
        title: 'Physical Therapy',
        icon: Activity,
        unread: getUnreadEmails('physical-therapy').length,
        pending: getPendingEmails('physical-therapy').length,
        total: 5,
        color: 'from-cyan-400 to-cyan-500',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-700'
      },
      {
        id: 'paying-for-care',
        title: 'Paying for Care',
        icon: CreditCard,
        unread: getUnreadEmails('paying-for-care').length,
        pending: getPendingEmails('paying-for-care').length,
        total: 6,
        color: 'from-lime-400 to-lime-500',
        bgColor: 'bg-lime-50',
        textColor: 'text-lime-700'
      }
    ];
    
    setEmailCategories(categories);
  }, []);

  return {
    totalUnread,
    totalPending,
    totalUnresponded,
    emailCategories
  };
};
