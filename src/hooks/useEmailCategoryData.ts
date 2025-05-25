
import { useEffect, useState } from 'react';
import { getUnreadEmails, getPendingEmails, getUnrespondedEmails, getEmailsByCategory } from '../data/emailData';
import { getAllCategories } from '../utils/categoryUtils';
import { Heart, Home, Shield, Scale, Users, Award, Activity, CreditCard, Folder } from 'lucide-react';

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

const categoryIconMap: Record<string, any> = {
  'senior-living': Heart,
  'home-care': Home,
  'government': Shield,
  'attorneys': Scale,
  'other-professionals': Users,
  'va': Award,
  'physical-therapy': Activity,
  'paying-for-care': CreditCard,
};

const categoryTextColorMap: Record<string, string> = {
  'senior-living': 'text-rose-700',
  'home-care': 'text-blue-700',
  'government': 'text-emerald-700',
  'attorneys': 'text-amber-700',
  'other-professionals': 'text-indigo-700',
  'va': 'text-teal-700',
  'physical-therapy': 'text-cyan-700',
  'paying-for-care': 'text-lime-700',
};

export const useEmailCategoryData = () => {
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalUnresponded, setTotalUnresponded] = useState(0);
  const [emailCategories, setEmailCategories] = useState<EmailCategory[]>([]);

  const loadCategories = () => {
    console.log('🔄 Loading categories...');
    setTotalUnread(getUnreadEmails().length);
    setTotalPending(getPendingEmails().length);
    setTotalUnresponded(getUnrespondedEmails().length);
    
    const allCategories = getAllCategories();
    console.log('📂 All categories from utils:', allCategories);
    
    const categories = Object.entries(allCategories).map(([id, categoryData]) => {
      const unreadCount = getUnreadEmails(id).length;
      const pendingCount = getPendingEmails(id).length;
      
      // Use predefined icon for known categories, Folder icon for custom ones
      const icon = categoryIconMap[id] || Folder;
      
      // Generate text color based on background color for custom categories
      let textColor = categoryTextColorMap[id];
      if (!textColor) {
        // For custom categories, derive text color from background color
        if (categoryData.bgColor.includes('purple')) textColor = 'text-purple-700';
        else if (categoryData.bgColor.includes('pink')) textColor = 'text-pink-700';
        else if (categoryData.bgColor.includes('red')) textColor = 'text-red-700';
        else if (categoryData.bgColor.includes('orange')) textColor = 'text-orange-700';
        else if (categoryData.bgColor.includes('yellow')) textColor = 'text-yellow-700';
        else if (categoryData.bgColor.includes('green')) textColor = 'text-green-700';
        else textColor = 'text-slate-700';
      }
      
      // Calculate total based on actual emails for custom categories, random for predefined ones
      let totalCount;
      if (categoryIconMap[id]) {
        // Predefined categories get random counts for demo purposes
        totalCount = Math.floor(Math.random() * 15) + 5;
      } else {
        // Custom categories get actual email counts
        const categoryEmails = getEmailsByCategory(id);
        totalCount = categoryEmails.length;
        console.log(`Custom category ${id} has ${totalCount} actual emails`);
      }
      
      return {
        id,
        title: categoryData.title,
        icon,
        unread: unreadCount,
        pending: pendingCount,
        total: totalCount,
        color: categoryData.color.replace('bg-gradient-to-r ', ''),
        bgColor: categoryData.bgColor,
        textColor
      };
    });
    
    console.log('✅ Categories loaded:', categories.length, categories.map(c => c.title));
    setEmailCategories(categories);
  };

  // Load email counts and categories
  useEffect(() => {
    loadCategories();
  }, []);

  return {
    totalUnread,
    totalPending,
    totalUnresponded,
    emailCategories,
    refreshCategories: loadCategories
  };
};
